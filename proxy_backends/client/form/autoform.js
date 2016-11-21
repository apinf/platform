import { TAPi18n } from 'meteor/tap:i18n';
import { Meteor } from 'meteor/meteor';
import { sAlert } from 'meteor/juliancwirko:s-alert';
import { AutoForm } from 'meteor/aldeed:autoform';

import { ProxyBackends } from '../../collection';
import deleteProxyBackendConfig from '../methods/delete_proxy_backend';
import convertToApiUmbrellaObject from '../methods/convert_to_apiUmbrella_object';

AutoForm.hooks({
  proxyBackendForm: {
    before: {
      insert (proxyBackend) {
        // No selected any proxy
        if (proxyBackend && proxyBackend.proxyId === undefined) {
          // Notify users about no selected proxy
          const message = TAPi18n.__('proxyBackendForm_informText_noOneSelectedProxy');
          sAlert.info(message)
          return false;
        }

        // Get reference to autoform instance, for form submission callback
        const form = this;

        // Empty fields case, check doc exists & has apiUmbrella object
        if (proxyBackend && proxyBackend.apiUmbrella) {
          const apiUmbrella = proxyBackend.apiUmbrella;

          const requiredUrlMatches = apiUmbrella.url_matches &&
            apiUmbrella.url_matches[0] &&
            apiUmbrella.url_matches[0].frontend_prefix &&
            apiUmbrella.url_matches[0].backend_prefix;

          const requiredServers = apiUmbrella.servers && apiUmbrella.servers[0] &&
            apiUmbrella.servers[0].host &&
            apiUmbrella.servers[0].port;

          // Check all required fields have values
          if (!(requiredUrlMatches) || !(requiredServers)) {
            // Alert the user of missing values
            const errorMessage = TAPi18n.__('proxyBackendForm_requiredErrorMessage');
            sAlert.error(errorMessage);
            // Cancel form
            return false;
          }
          // Create API backend on API Umbrella
          Meteor.call('createApiBackendOnApiUmbrella',
            proxyBackend.apiUmbrella, proxyBackend.proxyId,
            (error, response) => {
              if (error) {
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
              if (
                response.result &&
                response.result.data &&
                response.result.data.api) {
                  // Get the API Umbrella ID for newly created backend
                const umbrellaBackendId = response.result.data.api.id;

                  // Attach the API Umbrella backend ID to backend document
                proxyBackend.apiUmbrella.id = umbrellaBackendId;

                  // Publish the API Backend on API Umbrella
                Meteor.call(
                    'publishApiBackendOnApiUmbrella',
                    umbrellaBackendId, proxyBackend.proxyId,
                    (error, result) => {
                      if (error) {
                        Meteor.throw(500, error);
                      } else {
                        // Insert the Proxy Backend document, asynchronous
                        form.result(proxyBackend);
                      }
                    }
                  );
              }
            });
        }
      },
      update (updateDoc) {
        // Get proxyBackend $set values
        const currentProxyBackend = updateDoc.$set;

        if (currentProxyBackend) {
          // Get API id
          const apiId = currentProxyBackend.apiId;
          // Get proxy backend id
          const proxyBackendFromMongo = ProxyBackends.findOne({ apiId });

          // User selected the first item
          // Then delete proxy backend information from api umbrella
          if (currentProxyBackend.proxyId === undefined) {
            // Delete proxy backend information from api umbrella
            deleteProxyBackendConfig(proxyBackendFromMongo)

            return false;
          }

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

          const previousProxyId = proxyBackendFromMongo.proxyId;
          const currentProxyId = currentProxyBackend.proxyId;

          // TODO: In multi-proxy case. After changing proxy, onSuccess hook happens faster then umbrella id is got.
          // Check: if user changed proxy
          if (previousProxyId !== currentProxyId) {
            // Delete information about proxy backend from the first proxy and insert in the
            Meteor.call('deleteProxyBackend',
              proxyBackendFromMongo, false,
              function (error) {
                if (error) {
                  this.result(false);
                }
            });

            const convertedProxyBackend = convertToApiUmbrellaObject(currentProxyBackend);

            // Create API backend on API Umbrella
            Meteor.call('createApiBackendOnApiUmbrella',
              convertedProxyBackend.apiUmbrella, convertedProxyBackend.proxyId,
              function (error, response) {
                if (error) {
                  // Throw a Meteor error
                  sAlert.error(error)
                  // sync return false;
                  return false;
                }

                // If response has errors object, notify about it
                if (response.errors && response.errors.default) {
                  // Notify about error
                  sAlert.error(response.errors.default[0]);
                  // sync return false;
                  return false;
                }

                // If success, attach API Umbrella backend ID to API
                if (response.result && response.result.data && response.result.data.api) {
                  // Get the API Umbrella ID for newly created backend
                  const umbrellaBackendId = response.result.data.api.id;

                  // Attach the API Umbrella backend ID to backend document
                  convertedProxyBackend.apiUmbrella.id = umbrellaBackendId;

                  // Publish the API Backend on API Umbrella
                  Meteor.call('publishApiBackendOnApiUmbrella',
                    umbrellaBackendId, convertedProxyBackend.proxyId,
                    function (error) {
                      if (error) {
                        sAlert.error(error);
                        // sync return false;
                        return false;
                      }
                      // sync return the Proxy Backend document
                      updateDoc.$set = convertedProxyBackend;
                      return updateDoc;
                    }
                  );
                }
              });
          }
        }
        return updateDoc;
      },
    },
    onSuccess (formType, result) {
      if (formType === 'update') {
        // Get the Proxy Backend ID
        const proxyBackendId = this.docId;

        // Get Proxy Backend document
        const proxyBackend = ProxyBackends.findOne(proxyBackendId);

        // Get API Umbrella configuration object from Proxy Backend
        const apiUmbrellaBackend = proxyBackend.apiUmbrella;

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
                (error, result) => {
                  if (error) {
                    Meteor.throw(500, error);
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
      } else {
        // Get success message translation
        const message = TAPi18n.__('proxyBackendForm_successMessage');

        // Alert the user of success
        sAlert.success(message);
      }
    },
  },
});
