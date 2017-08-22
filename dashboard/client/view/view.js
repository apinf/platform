/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { Template } from 'meteor/templating';

// Collection imports
import Proxies from '/proxies/collection';
import ProxyBackends from '/proxy_backends/collection';

// Npm packages imports
import _ from 'lodash';

// APInf imports
import queryForDashboardPage from './query';

Template.dashboardView.onCreated(function () {
  // Get reference to template instance
  const instance = this;

  instance.elasticsearchData = new ReactiveVar();
  instance.error = new ReactiveVar();

  // Fetch Elasticsearch data reactively
  instance.autorun(() => {
    const proxy = Proxies.findOne();

    // Get relevant Elasticsearch host
    const elasticsearchHost = proxy.apiUmbrella.elasticsearch;

    if (elasticsearchHost) {
      // Fetch proxy backends
      const proxyBackends = ProxyBackends.find().fetch();

      // Create a list with requested paths
      const proxyBackendPaths = _.map(proxyBackends, (backend) => {
        const requestPath = backend.apiUmbrella.url_matches[0].frontend_prefix;
        return {
          wildcard: {
            request_path: {
              // Add '*' to partially match the url
              value: `${requestPath}*`,
            },
          },
        };
      });

      // Make query request
      const queryParams = queryForDashboardPage(proxyBackendPaths);

      // Get Elasticsearch data
      Meteor.call('getElasticsearchData', elasticsearchHost, queryParams, (error, result) => {
        if (error) {
          instance.error.set(error);
          throw Meteor.Error(error);
        }

        // Update Elasticsearch data reactive variable with result
        instance.elasticsearchData.set(result);
      });
    }
  });
});

Template.dashboardView.helpers({
  elasticsearchData () {
    // Get reference to template instance
    const instance = Template.instance();

    // Return Elasticsearch data
    return instance.elasticsearchData.get();
  },
  fetchingData () {
    const instance = Template.instance();
    // Return status about error or elasticsearch data
    return instance.elasticsearchData.get() || instance.error.get();
  },
  error () {
    const instance = Template.instance();
    // Return value of error
    return instance.error.get();
  },
});
