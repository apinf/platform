/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// Collection imports
import ProxyBackends from '/imports/proxy_backends/collection';
import Proxies from '/imports/proxies/collection';

// Npm packages imports
import URI from 'urijs';
import _ from 'lodash';
import got from 'got';

Meteor.methods({
  deleteProxyBackend (proxyBackend, deleteFromMongoDB = true) {
    // Make sure proxyBackend is an Object
    check(proxyBackend, Object);

    // Check what proxy type is selected
    if (proxyBackend.type === 'emq') {
      // TODO: remove proxy from EMQ
      // Delete proxyBackend from Apinf
      ProxyBackends.remove(proxyBackend._id);
    } else if (proxyBackend.type === 'apiUmbrella') {
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
    }
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
  getUrlAndAuthStrings (url) {
    check(url, String);

    // Init URI object instance
    const uri = new URI(url);

    /* eslint-disable no-underscore-dangle */
    // Construct auth string
    const auth = `${uri._parts.username}:${uri._parts.password}`;

    // Delete username & password credentials
    delete uri._parts.username;
    delete uri._parts.password;

    // Re-construct URI instance without auth credentials
    uri.normalize();

    // Retrun object with both values
    return {
      auth,
      url: `${uri.valueOf()}`,
    };
  },
  emqAclRequest (method, proxyId, rules) {
    check(method, String);
    check(proxyId, String);
    check(rules, Array);

    let rulesMap = [];
    // Assign default HTTP EMQ-ACL path
    const apiPath = 'emq-acl';

    // Find proxy attached to API
    const emqProxy = Proxies.findOne(proxyId);

    // Get HTTP API URL
    const emqHttpApi = emqProxy.emq.httpApi;

    // Get auth and url strings from URI
    const { auth, url } = Meteor.call('getUrlAndAuthStrings', emqHttpApi);

    if (method === 'POST') {
      // Map promises for each EMQ ACL rule
      rulesMap = _.map(rules, (rule) => {
        // Get data to be sent to EMQ-REST-API
        const data = {
          proxyId: rule.proxyId,
          id: rule.id,
          allow: rule.allow,
          access: rule.access,
          topic: rule.topic,
        };
        // Append ACL type & value
        data[rule.fromType] = rule.fromValue;

        // Send POST request to EMQ-REST-API
        // Append emq-acl path to URL
        return got.post(`${url}${apiPath}`, {
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
    } else if (method === 'PUT') {
      // Map promises for each EMQ ACL rule
      rulesMap = _.map(rules, (rule) => {
        // Get data to be sent to EMQ-REST-API
        const data = {
          id: rule.id,
          proxyId: rule.proxyId,
          allow: rule.allow,
          access: rule.access,
          topic: rule.topic,
        };
        // Append ACL type & value
        data[rule.fromType] = rule.fromValue;

        // Fetch list of existing rules from EMQ-REST-API by selected proxy ID
        return got.get(`${url}${apiPath}?proxyId=${proxyId}`, { auth, json: true })
          .then(res => {
            // SailsJS returnes an array of items in JSON format
            const aclRules = res.body;
            // Find the same rule as given from iteration
            const aclRuleExists = _.find(aclRules, (r) => {
              return r.id === rule.id;
            });

            // Check if ACL rule actually exists
            if (aclRuleExists) {
              // If ACL Rule aleady exists, only update it
              got.put(`${url}${apiPath}/${rule.id}`, { auth, json: true, body: data })
                .then((res1) => {
                  return res1;
                })
                .catch((err) => {
                  return err;
                });
            } else {
              // If ACL Rule does not exist on remote, then POST it
              got.post(`${url}${apiPath}`, { auth, json: true, body: data })
                .then((res1) => {
                  return res1;
                })
                .catch((err) => {
                  return err;
                });
            }
          })
          .catch((err) => {
            return err;
          });
      });
    }

    // Execute all promises
    Promise.all(rulesMap)
      .then(res => {
        return res;
      })
      .catch(err => {
        return err;
      });
  },
});
