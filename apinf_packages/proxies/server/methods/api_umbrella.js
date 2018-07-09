/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// Meteor contributed packages imports
import { ApiUmbrellaWeb } from 'meteor/apinf:api-umbrella';
import { TAPi18n } from 'meteor/tap:i18n';

// Npm packages imports
import _ from 'lodash';

// Collection imports
import Apis from '/apinf_packages/apis/collection';
import Proxies from '/apinf_packages/proxies/collection';
import ProxyBackends from '/apinf_packages/proxy_backends/collection';
import ApiKeys from '/apinf_packages/api_keys/collection';

// APInf imports
import hasValidApiUmbrellaSettings from '/apinf_packages/proxies/helper_functions/api_umbrella';

Meteor.methods({
  createApiUmbrellaWeb (proxyId) {
    // Make sure proxyId is a String
    check(proxyId, String);

    // Get proxy by proxyId
    const proxy = Proxies.findOne({ _id: proxyId });

    // Check if API Umbrella Web settings are valid
    if (hasValidApiUmbrellaSettings(proxy)) {
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

    // Make sure currentUser is a String
    check(currentUser, Object);

    // Make sure proxyId is a String
    check(proxyId, String);

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

      console.log(umbrellaUser)

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

  deleteApiUmbrellaUser (currentUser, proxyId) {

    /*
    Create API key & attach it for given user,
    Might throw errors, catch on client callback
    */

    // Make sure currentUser is a String
    check(currentUser, Object);

    // Make sure proxyId is a String
    check(proxyId, String);

    // Create apiUmbrellaWeb instance
    const umbrella = Meteor.call('createApiUmbrellaWeb', proxyId);
    // Create API Umbrella user object with required fields
    
    if (proxyId) {
     
      // Get API Key document
      //const userApiId = ApiKeys.findOne({ proxyId: proxyId });
      const userApiKey = ApiKeys.findOne({ proxyId: proxyId });
    
      // Check that Umbrella API key exists
      if (userApiKey && userApiKey.apiUmbrella) {
        // Get the API Key, from API key document
        console.log("************************************");
        console.log(userApiKey);
        
        apiId = userApiKey.apiUmbrella.id;
       
            // Try to create user on API Umbrella
        try {
          // Add user on API Umbrella
          console.log("************************************");
          console.log(umbrella.adminApi.v1.apiUsers)
          const response = umbrella.adminApi.v1.apiUsers.deleteUser(apiId);
          console.log("************************************");
          console.log(response);
          console.log(response.data);
          console.log(response.data.user);
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


      }
    }
  },

  createApiBackendOnApiUmbrella (apiBackend, proxyId) {
    // Make sure apiBackend is an Object
    check(apiBackend, Object);

    // Make sure proxyId is a String
    check(proxyId, String);

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
    // Make sure apiBackend is an Object
    check(apiBackend, Object);

    // Make sure proxyId is a String
    check(proxyId, String);

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
      // Get API Umbrella's endpoint
      const apiUmbrellaEndpoint = umbrella.adminApi.v1.apiBackends.updateApiBackend;

      // Send the API Backend to API Umbrella's endpoint for creation in the backend
      apiUmbrellaWebResponse.result = apiUmbrellaEndpoint(apiBackend.id, backend);
    } catch (apiUmbrellaError) {
      // set the errors object
      apiUmbrellaWebResponse.errors = { default: [apiUmbrellaError.message] };
      apiUmbrellaWebResponse.http_status = 422;
    }
    return apiUmbrellaWebResponse;
  },
  deleteApiBackendOnApiUmbrella (apiUmbrellaApiId, proxyId) {
    // Make sure apiUmbrellaApiId is a String
    check(apiUmbrellaApiId, String);

    // Make sure proxyId is a String
    check(proxyId, String);

    // Create ApiUmbrellaWeb instance
    const umbrella = Meteor.call('createApiUmbrellaWeb', proxyId);

    // Response object to be send back to client layer.
    const apiUmbrellaWebResponse = {
      result: {},
      http_status: 204,
      errors: {},
    };

    try {
      // Get API Umbrella's endpoint
      const apiUmbrellaEndpoint = umbrella.adminApi.v1.apiBackends.deleteApiBackend;

      // Send the API Backend to API Umbrella's endpoint for deletion in the backend
      apiUmbrellaWebResponse.result = apiUmbrellaEndpoint(apiUmbrellaApiId);
    } catch (apiUmbrellaError) {
      // Set the errors object
      apiUmbrellaWebResponse.errors = { default: [apiUmbrellaError.message] };
      apiUmbrellaWebResponse.http_status = 422;
    }
    return apiUmbrellaWebResponse;
  },
  publishApiBackendOnApiUmbrella (backendId, proxyId) {
    // Make sure backendId is a String
    check(backendId, String);

    // Make sure proxyId is a String
    check(proxyId, String);

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
});
