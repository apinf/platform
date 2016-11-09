import { Meteor } from 'meteor/meteor';
import { TAPi18n } from 'meteor/tap:i18n';
import { ApiUmbrellaWeb } from 'meteor/apinf:api-umbrella';
import { apiUmbrellaSettingsValid } from '/proxies/helper_functions/api_umbrella';
import { Apis } from '/apis/collection';
import { Proxies } from '/proxies/collection';
import { ProxyBackends } from '/proxy_backends/collection';

import _ from 'lodash';

Meteor.methods({
  createApiUmbrellaWeb (proxyId) {
    // Get proxy by proxyId
    const proxy = Proxies.findOne({ _id: proxyId });

    // Check if API Umbrella Web settings are valid
    if (proxy && apiUmbrellaSettingsValid(proxy)) {
      // Create config object for API Umbrella Web REST API
      const config = {
        baseUrl: `${proxy.apiUmbrella.url}/api-umbrella/`,
        apiKey: proxy.apiUmbrella.apiKey,
        authToken: proxy.apiUmbrella.authToken,
      };

      try {
        // Create new API Umbrella Web object for REST calls
        const apiUmbrellaWeb = new ApiUmbrellaWeb(config);
        // Return created object
        return apiUmbrellaWeb;
      } catch (error) {
        throw new Meteor.Error(error);
      }
    } else {
      throw new Meteor.Error('Proxy not defined or apiUmbrella settings are not valid.');
    }
  },
  createApiUmbrellaUser (currentUser, proxyId) {
    /*
    Create API key & attach it for given user,
    Might throw errors, catch on client callback
    */

    // Create apiUmbrellaWeb instance
    const umbrella = Meteor.call('createApiUmbrellaWeb', proxyId);
    // Create API Umbrella user object with required fields
    const apiUmbrellaUserObj = {
      user: {
        email: currentUser.emails[0].address,
        first_name: '-',
        last_name: '-',
        terms_and_conditions: true,
      },
    };

    // Try to create user on API Umbrella
    try {
      // Add user on API Umbrella
      const response = umbrella.adminApi.v1.apiUsers.createUser(apiUmbrellaUserObj);

      const umbrellaUser = response.data.user;

      // Return created umbrellaUser
      return umbrellaUser;
    } catch (error) {
      // Meteor Error (User create failed on Umbrella)
      throw new Meteor.Error(
        'umbrella-createuser-error',
        TAPi18n.__('umbrella_createuser_error')
      );
    }
  },
  createApiBackendOnApiUmbrella (apiBackend, proxyId) {
    // Create ApiUmbrellaWeb instance
    const umbrella = Meteor.call('createApiUmbrellaWeb', proxyId);

    // Construct an API Backend object
    const backend = {
      api: apiBackend,
    };

    // Default response object to be send back to client layer
    const response = {
      result: {},
      http_status: 200,
      errors: {},
    };

    try {
      // Send the API Backend to API Umbrella's endpoint for creation in the backend
      response.result = umbrella.adminApi.v1.apiBackends.createApiBackend(backend);
    } catch (error) {
      // Set the errors object
      response.errors = { default: [error.message] };
      response.http_status = 422;
    }

    return response;
  },
  updateApiBackendOnApiUmbrella (apiBackend, proxyId) {
    // Create ApiUmbrellaWeb instance
    const umbrella = Meteor.call('createApiUmbrellaWeb', proxyId);

    // Construct an API Backend object
    const backend = {
      api: apiBackend,
    };

    // Response object to be send back to client layer.
    const apiUmbrellaWebResponse = {
      result: {},
      http_status: 204,
      errors: {},
    };

    try {
      // Send the API Backend to API Umbrella's endpoint for creation in the backend
      apiUmbrellaWebResponse.result = umbrella.adminApi.v1.apiBackends.updateApiBackend(apiBackend.id, backend);
    } catch (apiUmbrellaError) {
      // set the errors object
      apiUmbrellaWebResponse.errors = { default: [apiUmbrellaError.message] };
      apiUmbrellaWebResponse.http_status = 422;
    }
    return apiUmbrellaWebResponse;
  },
  deleteApiBackendOnApiUmbrella (apiUmbrellaApiId, proxyId) {
    // Create ApiUmbrellaWeb instance
    const umbrella = Meteor.call('createApiUmbrellaWeb', proxyId);

    // Response object to be send back to client layer.
    const apiUmbrellaWebResponse = {
      result: {},
      http_status: 204,
      errors: {},
    };

    try {
      // Send the API Backend to API Umbrella's endpoint for deletion in the backend
      apiUmbrellaWebResponse.result = umbrella.adminApi.v1.apiBackends.deleteApiBackend(apiUmbrellaApiId);
    } catch (apiUmbrellaError) {
      // Set the errors object
      apiUmbrellaWebResponse.errors = { default: [apiUmbrellaError.message] };
      apiUmbrellaWebResponse.http_status = 422;
    }
    return apiUmbrellaWebResponse;
  },
  publishApiBackendOnApiUmbrella (backendId, proxyId) {
    // Create ApiUmbrellaWeb instance
    const umbrella = Meteor.call('createApiUmbrellaWeb', proxyId);

    // Response object to be send back to client layer.
    const response = {
      result: {},
      http_status: 201,
      errors: {},
    };

    try {
      // Send the API Backend to API Umbrella's endpoint for creation in the backend
      response.result = umbrella.adminApi.v1.config.publishSingleApiBackend(backendId);
    } catch (error) {
      // Set the errors object
      response.errors = { default: [error.message] };
      response.http_status = 422;
    }
    return response;
  },
  syncApiBackends () {
    // TODO: multi-proxy support
    /*
    This function does the following
      1. get a list of all backends on API Umbrella
      2. create a local API for each remote backend (if not existing)
      3. create a local Proxy Backend for each remote backend/local API pair
    */

    // Create ApiUmbrellaWeb instance
    const umbrella = Meteor.call('createApiUmbrellaWeb');

    // Placeholder variables
    let response;
    let remoteApis;

    try {
      // Get API Backends from API Umbrella instance
      response = umbrella.adminApi.v1.apiBackends.getApiBackends();
      remoteApis = response.data.data;
    } catch (error) {
      throw new Meteor.Error('api-umbrella-fetch',
       'Could not fetch API backends.',
        error
      );
    }

    try {
      _.forEach(remoteApis, (remoteApi) => {
        // Placeholder for API ID
        let apiId;

        // Get existing API Backend
        const existingLocalApi = Apis.findOne({ name: remoteApi.name });

        // Make sure API exists locally
        if (existingLocalApi) {
          // Get local API ID
          apiId = existingLocalApi._id;
        } else {
          /*
          Create API if it doesn't exist
          */

          // Construct an API document for the APIs collection
          const api = {
            name: remoteApi.name,
            url: `${remoteApi.backend_protocol}://${remoteApi.backend_host}`,
          };

          try {
            apiId = Apis.insert(api);
          } catch (error) {
            throw new Meteor.Error('insert-backend-error',
            `Error inserting apiBackend( ${remoteApi.id} ).`,
            error
          );
          }
        }

        /*
        Add Proxy Backend to match existing API
        */

        // Get ID of Proxy
        // TODO: refactor this for multi-proxy
        const proxyId = Proxies.findOne()._id;

        // Construct Proxy Backend document
        const proxyBackend = {
          apiId,
          proxyId,
          apiUmbrella: remoteApi,
        };

        ProxyBackends.insert(proxyBackend, { validate: false });
      });
    } catch (error) {
      throw new Meteor.Error('create-proxy-backend-error',
       error.message
      );
    }
  },
  elasticsearchIsDefined () {
    // TODO: multi-proxy support
    const proxy = Proxies.findOne();

    if (proxy) {
      const elasticsearch = proxy.apiUmbrella.elasticsearch;

      // Return true or false, depending on whether elasticsearch is defined
      return (elasticsearch);
    }

    return false;
  },
  getElasticsearchUrl () {
    if (Meteor.call('elasticsearchIsDefined')) {
      // TODO: multi-proxy support
      const elasticsearch = Proxies.findOne().apiUmbrella.elasticsearch;

      return elasticsearch;
    }

    throw new Meteor.Error('Elasticsearch is not defined');
  },
});
