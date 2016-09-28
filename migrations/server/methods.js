import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { Settings } from '/settings/collection';
import { Proxies } from '/proxies/collection';
import { Apis } from '/apis/collection';
import { ProxyBackends } from '/proxy_backends/collection';

Meteor.methods({
  migrateProxySettings () {
    const settings = Settings.findOne();

    // Check settings exist
    if (settings && settings.apiUmbrella) {
      // apiUmbrella/elasticsearch settings to Proxies (addProxy)
      const umbrellaObject = {
        url: settings.apiUmbrella.host,
        apiKey: settings.apiUmbrella.apiKey,
        authToken: settings.apiUmbrella.authToken,
        elasticsearch: settings.elasticsearch.host,
      };

      // New proxy
      const newProxy = {
        name: 'API Umbrella',
        description: 'Umbrella settings, migrated.',
        type: 'apiUmbrella',
        apiUmbrella: umbrellaObject,
      };
      // Insert proxy
      const proxyId = Proxies.insert(newProxy);
      console.log(`Proxy ${proxyId} inserted`);

      // Update settings doc (remove apiUmbrella & elasticsearch)
      Settings.update({}, { $unset: { apiUmbrella: '', elasticsearch: '' } }, { validate: false });
      console.log('Settings updated');
    }
  },
  migrateApiBackends () {
    // Step 2: Update all apiBackends

    // Init connection to old apiBackends
    const ApiBackends = new Mongo.Collection('apiBackends');

    // Iterate through apiBackends collection
    ApiBackends.find().forEach((apiBackend) => {
      // Construct apiUrl
      const apiUrl = `${apiBackend.backend_protocol}://${apiBackend.backend_host}`;
      // New api object
      const api = {
        name: apiBackend.name,
        description: apiBackend.description,
        url: apiUrl,
        documentationFileId: apiBackend.documentationFileId,
        apiLogoFileId: apiBackend.apiLogoFileId,
        documentation_link: apiBackend.documentation_link,
        created_at: apiBackend.created_at,
        created_by: apiBackend.created_by,
        updated_at: apiBackend.updated_at,
        updated_by: apiBackend.updated_by,
        version: apiBackend.version,
        managerIds: apiBackend.managerIds,
        bookmarkCount: apiBackend.bookmarkCount,
        isPublic: apiBackend.isPublic,
        submit_methods: [],
        averageRating: 0,
      };

      // Insert migrated api, get Id
      const apiId = Apis.insert(api);
      console.log(`Api ${apiId} inserted`);

      // Get proxyId
      const proxyId = Proxies.findOne()._id;

      // umbrellaObject
      const umbrellaObject = {
        id: apiBackend.id,
        name: apiBackend.name,
        frontend_host: apiBackend.frontend_host,
        backend_host: apiBackend.backend_host,
        backend_protocol: apiBackend.backend_protocol,
        balance_algorithm: apiBackend.balance_algorithm,
        url_matches: apiBackend.url_matches,
        servers: apiBackend.servers,
        settings: apiBackend.settings,
      };

      // new proxyBackend
      const proxyBackend = {
        proxyId,
        apiId,
        apiUmbrella: umbrellaObject,
      };

      // Insert migrated proxyBackend
      const proxyBackendId = ProxyBackends.insert(proxyBackend, { validate: false });
      console.log(`ProxyBackend ${proxyBackendId} inserted`);
    });
  },
});
