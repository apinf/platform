import { Meteor } from 'meteor/meteor';

import { ProxyBackends } from '/proxy_backends/collection';


Meteor.methods({
  deleteProxyBackend (proxyBackend) {
    // Get umbrellaBackendId
    const umbrellaBackendId = proxyBackend.apiUmbrella.id;

    // Delete API Backend on API Umbrella
    Meteor.call(
      'deleteApiBackendOnApiUmbrella',
      umbrellaBackendId,
      (deleteError) => {
        if (deleteError) {
          throw new Meteor.Error('delete-error');
        } else {
          // Publish changes for deleted API Backend on API Umbrella
          Meteor.call(
            'publishApiBackendOnApiUmbrella',
            umbrellaBackendId,
            (publishError) => {
              if (publishError) {
                throw new Meteor.Error('publish-error');
              } else if (proxyBackend._id) { // Check proxyBackend has _id
                // Delete proxyBackend from Apinf
                ProxyBackends.remove(proxyBackend._id);
              }
            }
          );
        }
      }
    );
  },
});
