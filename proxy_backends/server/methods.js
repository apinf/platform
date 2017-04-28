/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// Collection imports
import ProxyBackends from '/proxy_backends/collection';
import Proxies from '/proxies/collection';

import URI from 'urijs';
import _ from 'lodash';
import got from 'got';

Meteor.methods({
  deleteProxyBackend (proxyBackend, deleteFromMongoDB = true) {
    // Make sure proxyBackend is an Object
    check(proxyBackend, Object);

    // Get umbrellaBackendId
    const umbrellaBackendId = proxyBackend.apiUmbrella.id;

    // Delete API Backend on API Umbrella
    Meteor.call(
      'deleteApiBackendOnApiUmbrella',
      umbrellaBackendId, proxyBackend.proxyId,
      (deleteError) => {
        if (deleteError) {
          throw new Meteor.Error('delete-error');
        } else {
          // Publish changes for deleted API Backend on API Umbrella
          Meteor.call(
            'publishApiBackendOnApiUmbrella',
            umbrellaBackendId, proxyBackend.proxyId,
            (publishError) => {
              if (publishError) {
                throw new Meteor.Error('publish-error');
              } else if (deleteFromMongoDB && proxyBackend._id) {
                // Check: delete from MongoDB and proxyBackend has _id
                // Delete proxyBackend from Apinf
                ProxyBackends.remove(proxyBackend._id);
              }
            }
          );
        }
      }
    );
  },
  uniqueFrontendPrefix (proxyBackend) {
    // Make sure proxyBackend is an Object
    check(proxyBackend, Object);

    // Get frontend prefix
    const frontendPrefix = proxyBackend.apiUmbrella.url_matches[0].frontend_prefix;

    // Get document with specified forntend_prefix
    const documentExist = ProxyBackends.findOne({
      'apiUmbrella.url_matches.frontend_prefix': frontendPrefix,
    });

    // Return boolean based on uniqueness
    if (documentExist) {
      return false;
    }
    return true;
  },
  removeAuthFromUri (uri) {
    let url = `${uri.protocol}://${uri.hostname}`;

    if (uri.port) url += `:${uri.port}`;

    return url;
  },
  postEmqAcl ({ proxyId, rules }) {
    check(proxyId, String);
    check(rules, Array);

    const emqProxy = Proxies.findOne(proxyId);

    const emqHttpApi = emqProxy.emq.httpApi;

    const uri = URI.parse(emqHttpApi);
    const url = Meteor.call('removeAuthFromUri', uri);
    const auth = `${uri.username}:${uri.password}`;

    const postedEmqRules = _.map(rules, (rule) => {
      const data = {
        allow: rule.allow,
        access: rule.access,
        topic: rule.topic,
      };
      data[rule.fromType] = rule.fromValue;

      return got.post(`${url}/emq-acl`, {
        auth,
        json: true,
        body: data,
      })
        .then(res => {
          return res;
        })
        .catch(err => {
          return err;
        });
    });

    Promise.all(postedEmqRules)
      .then(res => {
        return res;
      })
      .catch(err => {
        return err;
      });
  },
  updateEmqAcl ({ proxyId, rules }) {
    check(proxyId, String);
    check(rules, Array);
    // TODO: add emq method to update rules
  },
});
