import { apiUmbrellaSettingsValid } from '/proxies/helper_functions/api_umbrella';
import { Meteor } from 'meteor/meteor';
import { Apis } from '/apis/collection';
import { Proxies } from '/proxies/collection';
import { ProxyBackends } from '/proxy_backends/collection';
import { TAPi18n } from 'meteor/tap:i18n';

import _ from 'lodash';

Meteor.methods({
  createApiBackendOnApiUmbrella (apiBackend) {
    // Create ApiUmbrellaWeb instance
    const umbrella = Meteor.call('createApiUmbrellaWeb');

    // Construct an API Backend object for API Umbrella with one 'api' key
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
  createApiUmbrellaUser (currentUser) {
    /*
    Create API key & attach it for given user,
    Might throw errors, catch on client callback
    */

    // Create apiUmbrellaWeb instance
    const umbrella = Meteor.call('createApiUmbrellaWeb');
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
  createApiUmbrellaWeb () {
    // TODO: Fix for multi-proxy support
    const proxy = Proxies.findOne();

    // Check if API Umbrella Web settings are valid
    if (apiUmbrellaSettingsValid(proxy)) {
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
      throw new Meteor.Error('ApiUmbrella settings are not valid.');
    }
  },
  deleteApiBackendOnApiUmbrella (apiUmbrellaApiId) {
    // Create ApiUmbrellaWeb instance
    const umbrella = Meteor.call('createApiUmbrellaWeb');

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
  elasticsearchIsDefined () {
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
      const elasticsearch = Proxies.findOne().apiUmbrella.elasticsearch;

      return elasticsearch;
    }

    throw new Meteor.Error('Elasticsearch is not defined');
  },
  publishApiBackendOnApiUmbrella (backendId) {
    // Create ApiUmbrellaWeb instance
    const umbrella = Meteor.call('createApiUmbrellaWeb');

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
    /*
    This function does the following
      1. get a list of all backends on API Umbrella
      2. create a local API for each remote backend (if not existing)
      3. create a local Proxy Backend for each remote backend/local API pair
    */

    // Create ApiUmbrellaWeb instance
    const umbrella = Meteor.call('createApiUmbrellaWeb');

    // Placeholder variables
    let response, remoteApis;

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
  syncApiUmbrellaAdmins () {
    // Create apiUmbrellaWeb instance
    const umbrella = Meteor.call('createApiUmbrellaWeb');

    try {
      // Get admin users from API Umbrella instance
      const response = umbrella.adminApi.v1.adminUsers.getAdmins();

      // Add each admin user to collection if not already there
      const apiAdmins = response.data.data;

      _.forEach(apiAdmins, (apiAdmin) => {
        // Get existing admin user
        const existingAdminUser = ApiUmbrellaAdmins.findOne({ id: apiAdmin.id });

        // If admin user doesn't exist in collection, insert into collection
        if (existingAdminUser === undefined) {
          ApiUmbrellaAdmins.insert(apiAdmin);
        }
      });
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },
  syncApiUmbrellaUsers () {
    // Create apiUmbrellaWeb instance
    const umbrella = Meteor.call('createApiUmbrellaWeb');

    // Get users from API Umbrella instance
    const response = umbrella.adminApi.v1.apiUsers.getUsers();

    // Add each user to collection if not already there
    const apiUsers = response.data.data;

    _.forEach(apiUsers, (apiUser) => {
      // Get existing user
      const existingUser = ApiUmbrellaUsers.findOne({ id: apiUser.id });

      // If user doesn't exist in collection, insert into collection
      if (existingUser === undefined) {
        ApiUmbrellaUsers.insert(apiUser);
      }
    });
  },
  updateApiBackendOnApiUmbrella (apiUmbrellaBackendId, apiBackend) {
    // Create ApiUmbrellaWeb instance
    const umbrella = Meteor.call('createApiUmbrellaWeb');

    // Construct an API Backend object for API Umbrella with one 'api' key
    const constructedBackend = {
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
      apiUmbrellaWebResponse.result = umbrella.adminApi.v1.apiBackends.updateApiBackend(apiUmbrellaBackendId, constructedBackend);
    } catch (apiUmbrellaError) {
      // set the errors object
      apiUmbrellaWebResponse.errors = { default: [apiUmbrellaError.message] };
      apiUmbrellaWebResponse.http_status = 422;
    }
    return apiUmbrellaWebResponse;
  },
});
