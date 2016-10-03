import { TAPi18n } from 'meteor/tap:i18n';
import { Meteor } from 'meteor/meteor';
import { sAlert } from 'meteor/juliancwirko:s-alert';
import { AutoForm } from 'meteor/aldeed:autoform';

import { ProxyBackends } from '../../collection';

AutoForm.hooks({
  proxyBackendForm: {
    before: {
      insert (proxyBackend) {
        // Get reference to autoform instance, for form submission callback
        const form = this;

        // Get API Umbrella configuration
        Meteor.call('createApiBackendOnApiUmbrella',
          proxyBackend.apiUmbrella,
          (error, response) => {
            if (error) {
              // Throw a Meteor error
              Meteor.error(500, error);
            } else if ( // If success, attach API Umbrella backend ID to API
              response.result &&
              response.result.data &&
              response.result.data.api
            ) {
                // Get the API Umbrella ID for newly created backend
              const umbrellaBackendId = response.result.data.api.id;

                // Attach the API Umbrella backend ID to backend document
              proxyBackend.apiUmbrella.id = umbrellaBackendId;

                // Publish the API Backend on API Umbrella
              Meteor.call(
                  'publishApiBackendOnApiUmbrella',
                  umbrellaBackendId,
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
          apiUmbrellaBackend.id,
          apiUmbrellaBackend,
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
                apiUmbrellaBackend.id,
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
