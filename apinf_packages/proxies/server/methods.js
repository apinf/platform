/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// Collection imports
import AnalyticsData from '/apinf_packages/analytics/collection';
import Proxies from '/apinf_packages/proxies/collection';
import ProxyBackends from '/apinf_packages/proxy_backends/collection';

// APInf imports
import promisifyCall from '/apinf_packages/core/helper_functions/promisify_call';

Meteor.methods({
  removeProxy (proxyId) {
    check(proxyId, String);
    // Placeholder
    const promises = [];

    // Get all proxy backends are connected to removing Proxy
    ProxyBackends.find({ proxyId }).forEach((proxyBackend) => {
      // Get ID of related API Umbrella backend
      const umbrellaBackendId = proxyBackend.apiUmbrella.id;

      // Create a personal promise for each proxy backend
      // Promise to delete backend from API Umbrella
      const promise = promisifyCall(
        'deleteApiBackendOnApiUmbrella', umbrellaBackendId, proxyId
      )
        .then(() => {
          // Promise to publish changes on API Umbrella
          promisifyCall(
            'publishApiBackendOnApiUmbrella', umbrellaBackendId, proxyId
          );
        })
        .then(() => {
          // Remove Proxy backend configuration from database
          ProxyBackends.remove(proxyBackend._id);
          // Remove related AnalyticsData
          AnalyticsData.remove({ proxyId });
          // Stop cron to calculate Analytics Data
          Meteor.call('stopCalculateAnalyticsData', proxyBackend._id);
        })
        .catch(err => {
          throw new Meteor.Error(err);
        });

      // Store promise
      promises.push(promise);
    });

    return Promise.all(promises)
      .then(
        // On success result
        () => {
          // If all proxy backends were removed successfully from API Umbrella and database
          // Then remove proxy
          Proxies.remove(proxyId);
        },
        // On error result
        (err) => {
          throw new Meteor.Error(err);
        }
      );
  },
});

