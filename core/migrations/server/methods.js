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
      Proxies.insert(newProxy);

      // Update settings doc (remove apiUmbrella & elasticsearch)
      Settings.update({}, { $unset: { apiUmbrella: '', elasticsearch: '' } }, { validate: false });
    }
  },
  migrateApiBackends () {
    // Step 2: Update all apiBackends

    // Init connection to old apiBackends
    const ApiBackends = new Mongo.Collection('apiBackends');

    // Running number for duplicates
    let duplicateCounter = 1;

    // Iterate through apiBackends collection
    ApiBackends.find().forEach((apiBackend) => {
      // Construct apiUrl
      const apiUrl = `${apiBackend.backend_protocol}://${apiBackend.backend_host}`;

      // New api object
      const api = {
        name: apiBackend.name, // check unique
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

      /** Solve api.name unique **/

      // Init apiId
      let apiId = null;

      do {
        try {
          apiId = Apis.insert(api);
        } catch (error) {
          // Catch duplicate error with unique index
          if (error &&
            error.name === 'MongoError' &&
            error.code === 11000) {
            // Add duplicateCounter value after api.name
            api.name = `${api.name}${duplicateCounter}`;
          } else {
            // Something else weird, give up
            break;
          }
        }
      } while (!apiId);

      /** ProxyBackend migrating **/

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
        url_matches: apiBackend.url_matches, // 'url_matches.$.frontend_prefix' check unique
        servers: apiBackend.servers,
        settings: apiBackend.settings,
      };

      // new proxyBackend
      const proxyBackend = {
        proxyId,
        apiId,
        apiUmbrella: umbrellaObject,
      };

      /** Solve unique & proxyBackend regex validation errors **/

      // Init proxyBackendId
      let proxyBackendId = null;
      // Try until insert succeeds
      do {
        try {
          proxyBackendId = ProxyBackends.insert(proxyBackend);
        } catch (error) {
          // Catch regex validation error code
          if (error &&
            error.sanitizedError &&
            error.sanitizedError.error === 400) {
            // Get umbrella object
            const umbrella = proxyBackend.apiUmbrella;
            // Add slash after frontend_prefix
            const newPrefix = `${umbrella.url_matches[0].frontend_prefix}/`;
            console.log(newPrefix);
            umbrella.url_matches[0].frontend_prefix = newPrefix;
          // Catch duplicate error with unique index
          } else if (error &&
              error.name === 'MongoError' &&
              error.code === 11000) {
            // Get umbrella object
            const umbrella = proxyBackend.apiUmbrella;
            // Add duplicateCounter value after frontend_prefix
            const newPrefix = `${umbrella.url_matches[0].frontend_prefix}${duplicateCounter}`;
            console.log(newPrefix);
            umbrella.url_matches[0].frontend_prefix = newPrefix;
          } else {
            // Something else weird, give up
            break;
          }
        }
        // Leave loop when insert is successful
      } while (!proxyBackendId);
      // Increment duplicateCounter
      duplicateCounter += 1;
    });

    // Finally drop old apiBackends
    ApiBackends.rawCollection().drop();
  },
});
