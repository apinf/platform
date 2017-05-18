/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Meteor contributed packages imports
import { AutoForm } from 'meteor/aldeed:autoform';
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';

// Npm packages imports
import _ from 'lodash';

// Collection imports
import ProxyBackends from '../../collection';

// APINF imports
import convertToApiUmbrellaObject from '../methods/convert_to_apiUmbrella_object';

AutoForm.hooks({
  proxyBackendForm: {
    before: {
      insert (proxyBackend) {
        // TODO: Refactor this method. It is too long and complex

        // Get reference to autoform instance, for form submission callback
        const form = this;

        // Empty fields case, check doc exists & has apiUmbrella object
        if (proxyBackend.type === 'apiUmbrella') {
          Meteor.call('uniqueFrontendPrefix', proxyBackend, (error, unique) => {
            // Check if frontend prefix is unique
            if (unique) {
              // Create API backend on API Umbrella
              Meteor.call('createApiBackendOnApiUmbrella', proxyBackend.apiUmbrella, proxyBackend.proxyId, (createApiBackendOnApiUmbrellaError, response) => { // eslint-disable-line max-len
                if (createApiBackendOnApiUmbrellaError) {
                    // Throw a Meteor error
                  Meteor.error(500, error);
                  return false;
                }

                  // If response has errors object, notify about it
                if (response.errors && response.errors.default) {
                    // Notify about error
                  sAlert.error(response.errors.default[0]);
                    // return false;
                  form.result(false);
                }

                  // If success, attach API Umbrella backend ID to API
                if (_.get(response, 'response.result.data.api')) {
                    // Get the API Umbrella ID for newly created backend
                  const umbrellaBackendId = response.result.data.api.id;

                  // Attach the API Umbrella backend ID to backend document
                  proxyBackend.apiUmbrella.id = umbrellaBackendId;

                    // Publish the API Backend on API Umbrella
                  Meteor.call('publishApiBackendOnApiUmbrella',
                      umbrellaBackendId, proxyBackend.proxyId,
                      (publishApiBackendOnApiUmbrellaError) => {
                        if (publishApiBackendOnApiUmbrellaError) {
                          Meteor.throw(500, error);
                        } else {
                          // Insert the Proxy Backend document, asynchronous
                          form.result(proxyBackend);
                        }
                        // Autoform does not expect anything to be returned
                        return undefined;
                      }
                    );
                }
                  // Autoform does not expect anything to be returned
                return undefined;
              });
            } else {
              // Alert the user of frontend prefix unique issue
              const errorMessage = TAPi18n.__('proxyBackendForm_frontendPrefixNotUnique');
              sAlert.error(errorMessage);
              // Cancel form
              form.result(false);
            }
          });
        } else if (proxyBackend.type === 'emq') {
          // Before insert iterate through ACL rules
          proxyBackend.emq.settings.acl.forEach((aclRule) => {
            // Adding ID field for each rule separately is needed to differentiate
            // add edit them
            aclRule.id = new Meteor.Collection.ObjectID().valueOf();

            // Add proxy backend ID value
            aclRule.proxyId = proxyBackend.proxyId;
          });

          // Save proxy backend
          form.result(proxyBackend);
        }
        // Autoform does not expect anything to be returned
        return undefined;
      },
      update (updateDoc) {
        // TODO: Refactor this method. It is too long and complex

        // Get reference to autoform instance, for form submission callback
        const form = this;
        // Get proxyBackend $set values
        const currentProxyBackend = updateDoc.$set;

        if (currentProxyBackend.type === 'apiUmbrella') {
          // Check all required fields have values
          const requiredUrlMatches = currentProxyBackend['apiUmbrella.url_matches'] &&
            currentProxyBackend['apiUmbrella.url_matches'][0] &&
            currentProxyBackend['apiUmbrella.url_matches'][0].frontend_prefix &&
            currentProxyBackend['apiUmbrella.url_matches'][0].backend_prefix;

          const requiredServers = currentProxyBackend['apiUmbrella.servers'] &&
            currentProxyBackend['apiUmbrella.servers'][0] &&
            currentProxyBackend['apiUmbrella.servers'][0].host &&
            currentProxyBackend['apiUmbrella.servers'][0].port;

          if (!(requiredUrlMatches) || !(requiredServers)) {
            // Alert the user of missing values
            const errorMessage = TAPi18n.__('proxyBackendForm_requiredErrorMessage');
            sAlert.error(errorMessage);
            // Cancel form
            return false;
          }

          // Get API id
          const apiId = currentProxyBackend.apiId;
          // Get proxy backend id
          const previousProxyBackend = ProxyBackends.findOne({ apiId });

          const previousProxyId = previousProxyBackend.proxyId;
          const currentProxyId = currentProxyBackend.proxyId;

          // Check: if user changed proxy
          if (previousProxyId === currentProxyId) {
            // Case 1: Proxy not changed, return modifier
            updateDoc.$set = currentProxyBackend;
            form.result(updateDoc);
          } else {
            // Case 2: Proxy changed
            // Delete information about proxy backend from the first proxy and insert in the
            Meteor.call('deleteProxyBackend',
              previousProxyBackend, false,
              (error) => {
                if (error) {
                  form.result(false);
                }
              });

            const convertedProxyBackend = convertToApiUmbrellaObject(currentProxyBackend);

            // Create API backend on API Umbrella
            Meteor.call('createApiBackendOnApiUmbrella',
              convertedProxyBackend.apiUmbrella, convertedProxyBackend.proxyId,
              (error, response) => {
                if (error) {
                  // Throw a Meteor error
                  sAlert.error(error);
                  // async return false;
                  form.result(false);
                }

                // If response has errors object, notify about it
                if (response.errors && response.errors.default) {
                  // Notify about error
                  sAlert.error(response.errors.default[0]);
                  // async return false;
                  form.result(false);
                }

                // If success, attach API Umbrella backend ID to API
                if (response.result && response.result.data && response.result.data.api) {
                  // Get the API Umbrella ID for newly created backend
                  const umbrellaBackendId = response.result.data.api.id;

                  // Attach the API Umbrella backend ID to backend document
                  currentProxyBackend['apiUmbrella.id'] = umbrellaBackendId;

                  // Publish the API Backend on API Umbrella
                  Meteor.call('publishApiBackendOnApiUmbrella',
                    umbrellaBackendId, currentProxyBackend.proxyId,
                    (publishError) => {
                      if (publishError) {
                        sAlert.error(publishError);
                        // async return false;
                        form.result(false);
                      }
                      // async return the Proxy Backend document
                      updateDoc.$set = currentProxyBackend;
                      form.result(updateDoc);
                    }
                  );
                }
              });
          }
        } else {
          if (updateDoc.$set['emq.settings.acl']) {
            // Before insert iterate through ACL rules
            updateDoc.$set['emq.settings.acl'].forEach((aclRule) => {
              // Adding ID field for each rule separately is needed to differentiate
              // add edit them
              if (!aclRule.id) {
                aclRule.id = new Meteor.Collection.ObjectID().valueOf();
              }

              // Add proxy backend ID value if needed
              if (!aclRule.proxyId) {
                aclRule.proxyId = updateDoc.$set.proxyId;
              }
            });
          }
          // Update EMQ proxy backend
          form.result(updateDoc);
        }
        // Autoform does not expect anything to be returned
        return undefined;
      },
    },
    onSuccess (formType) {
      // Get the Proxy Backend ID
      const proxyBackendId = this.docId;

      // Get Proxy Backend document
      const proxyBackend = ProxyBackends.findOne(proxyBackendId);

      // Get API Umbrella configuration object from Proxy Backend
      const apiUmbrellaBackend = proxyBackend.apiUmbrella;

      // Check what form type is submitter - update or insert
      // Form type - UPDATE
      if (formType === 'update') {
        // Check what proxy type is selected
        // **** API Umbrella *****
        if (proxyBackend.type === 'apiUmbrella') {
          // Update API on API Umbrella
          Meteor.call(
            'updateApiBackendOnApiUmbrella',
            apiUmbrellaBackend, proxyBackend.proxyId,
            (error) => {
              // Check for error
              if (error) {
                // Throw error for debugging
                // TODO: indicate that API Umbrella may be out of sync with local collection
                Meteor.throw(500, error);
              } else {
                // Publish the API Backend on API Umbrella
                Meteor.call(
                  'publishApiBackendOnApiUmbrella',
                  apiUmbrellaBackend.id, proxyBackend.proxyId,
                  (publishError) => {
                    if (publishError) {
                      Meteor.throw(500, publishError);
                    } else {
                      // Get update success message translation
                      const message = TAPi18n.__('proxyBackendForm_update_successMessage');

                      // Alert the user of success
                      sAlert.success(message);
                    }
                  }
                );
              }
            }
          );
        // **** EMQ *****
        } else if (proxyBackend.type === 'emq') {
          Meteor.call('emqAclRequest',
            'PUT',
            proxyBackend.proxyId,
            proxyBackend.emq.settings.acl,
          (err) => {
            if (err) {
              sAlert.error(err);
            } else {
              // Get success message translation
              const message = TAPi18n.__('proxyBackendForm_successMessage');

              // Alert the user of success
              sAlert.success(message);
            }
          });
        }
      // Form Type - INSERT
      } else {
        // Check what proxy backend is selected
        if (proxyBackend.type === 'emq') {
          Meteor.call('emqAclRequest',
            'POST',
            proxyBackend.proxyId,
            proxyBackend.emq.settings.acl,
          (err) => {
            if (err) sAlert.error(err);
          });
        }

        // Get success message translation
        const message = TAPi18n.__('proxyBackendForm_successMessage');

        // Alert the user of success
        sAlert.success(message);
      }
    },
    onError (formType, error) {
      sAlert.error(error.message);
    },
  },
});
