import { Meteor } from 'meteor/meteor';

import { ProxyBackends } from '/proxy_backends/collection';


Meteor.methods({
  deleteProxyBackend (proxyBackend, deleteFromMongoDB = true) {
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
});
