import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { sAlert } from 'meteor/juliancwirko:s-alert';
import { ProxyBackends } from '/proxy_backends/collection';

Template.apiProxy.events({
  'click #delete-proxy-backend': () => {
    /* Function procedure in generic form
    1. Delete API Backend on proxy (eg. API Umbrella)
      - call necessary functions by proxy type
    2. Delete Proxy Backend on Apinf
    */

    // Get template instance
    const instance = Template.instance();

    // Get proxyBackend from template data
    const proxyBackend = instance.data.proxyBackend;

    // Check proxyBackend exists
    if (proxyBackend) {
      // Check if proxyBackend type is apiUmbrella & it has id
      if (proxyBackend.apiUmbrella && proxyBackend.apiUmbrella.id) {
        const umbrellaBackendId = instance.data.proxyBackend.apiUmbrella.id;

        // Delete API Backend on API Umbrella
        Meteor.call(
          'deleteApiBackendOnApiUmbrella',
          umbrellaBackendId,
          (deleteError) => {
            if (deleteError) {
              sAlert.error(`Delete failed on Umbrella:\n ${deleteError}`);
            } else {
              // Publish changes for deleted API Backend on API Umbrella
              Meteor.call(
                'publishApiBackendOnApiUmbrella',
                umbrellaBackendId,
                (publishError) => {
                  if (publishError) {
                    sAlert.error(`Publish failed on Umbrella:\n ${publishError}`);
                  } else if (proxyBackend._id) { // Check proxyBackend has _id
                    // Delete proxyBackend from Apinf
                    ProxyBackends.remove(proxyBackend._id);
                    sAlert.success('Successfully deleted proxy settings');
                  }
                }
              );
            }
          }
        );
      }
    }
  },
});
