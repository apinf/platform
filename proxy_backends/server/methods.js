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
  removeAuthFromUrl (url) {
    check(url, String);

    // Init URI instance
    const uri = new URI(url);

    // Delete username & password credentials
    delete uri._parts.username; // eslint-disable-line no-underscore-dangle
    delete uri._parts.password; // eslint-disable-line no-underscore-dangle

    // Re-construct URI instance without auth credentials
    uri.normalize();

    // Return string value
    return uri.valueOf();
  },
  getAuthStringFromUrl (url) {
    check(url, String);

    // Init URI object instance
    const uri = URI.parse(url);

    // Construct auth string
    const authString = `${uri.username}:${uri.password}`;

    return authString;
  },
  postEmqAcl ({ proxyId, rules }) {
    check(proxyId, String);
    check(rules, Array);

    // Find proxy attached to API
    const emqProxy = Proxies.findOne(proxyId);

    // Get HTTP API URL
    const emqHttpApi = emqProxy.emq.httpApi;

    // Get auth string from URL
    const authString = Meteor.call('getAuthStringFromUrl', emqHttpApi);
    // Remove auth credentials from URL
    let url = Meteor.call('removeAuthFromUrl', emqHttpApi);
    // Append emq-acl path to URL
    url += 'emq-acl';

    // Map promises for each EMQ ACL rule
    const postedEmqRules = _.map(rules, (rule) => {
      // Get data to be sent to EMQ-REST-API
      const data = {
        allow: rule.allow,
        access: rule.access,
        topic: rule.topic,
      };
      // Append ACL type & value
      data[rule.fromType] = rule.fromValue;

      if (!rule.id) {
        data.id = new Meteor.Collection.ObjectID().valueOf();
      }

      // Send POST request to EMQ-REST-API
      return got.post(`${url}`, {
        auth: authString,
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

    // Execute all promises
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
