import { apiUmbrellaSettingsValid } from '/proxies/helper_functions/api_umbrella';
import { Meteor } from 'meteor/meteor';
import { Apis } from '/apis/collection';
import { Proxies } from '/proxies/collection';

import _ from 'lodash';

Meteor.methods({
  elasticsearchIsDefined () {
    const proxy = Proxies.findOne();

    if (proxy) {
      const elasticsearch = proxy.apiUmbrella.elasticsearch;

      return (elasticsearch) ? true : false;
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
  apiUmbrellaUrlIsDefined () {
    const proxy = Proxies.findOne(); // For now checking for only one proxy

    if (proxy) {
      const apiUmbrellaUrl = proxy.apiUmbrella.url;

      // tyk/kong or other apiUmbrellas should be checked here

      return (apiUmbrellaUrl) ? true : false;
    }

    return false;
  },
  getApiUmbrellaUrl () {
    if (Meteor.call('apiUmbrellaUrlIsDefined')) {
      const apiUmbrellaUrl = Proxies.findOne().apiUmbrella.url;

      return apiUmbrellaUrl;
    }

    throw new Meteor.Error('Api Umbrella Url is not defined');
  },
  createApiUmbrellaWeb () {
    // TODO: Fix for multi-proxy support
    const proxy = Proxies.findOne();

    // Check if API Umbrella Web settings are valid
    if (apiUmbrellaSettingsValid(proxy)) {
      // Create config object for API Umbrella Web REST API
      const config = {
        baseUrl: proxy.apiUmbrella.url + '/api-umbrella/',
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
  syncApiUmbrellaUsers () {
    // Create apiUmbrellaWeb instance
    const umbrella = Meteor.call('createApiUmbrellaWeb');

    // Get users from API Umbrella instance
    const response = umbrella.adminApi.v1.apiUsers.getUsers();

    // Add each user to collection if not already there
    const apiUsers = response.data.data;

    _.forEach(apiUsers, (apiUser) => {
      // Get existing user
      const existingUser = ApiUmbrellaUsers.findOne({ 'id': apiUser.id });

      // If user doesn't exist in collection, insert into collection
      if (existingUser === undefined) {
        ApiUmbrellaUsers.insert(apiUser);
      }
    });
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
        const existingAdminUser = ApiUmbrellaAdmins.findOne({ 'id': apiAdmin.id });

        // If admin user doesn't exist in collection, insert into collection
        if (existingAdminUser === undefined) {
          ApiUmbrellaAdmins.insert(apiAdmin);
        }
      });
    } catch (error) {
      throw new Metoer.Error(error);
    }
  },
  // Create API key & attach it for given user,
  // Might throw errors, catch on client callback
  createApiUmbrellaUser (currentUser) {
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
  syncApiBackends () {
    // Create ApiUmbrellaWeb instance
    const umbrella = Meteor.call('createApiUmbrellaWeb');

    try {
      // Get API Backends from API Umbrella instance
      const response = umbrella.adminApi.v1.apiBackends.getApiBackends();
      const remoteApis = response.data.data;

      // Get all local API Backends
      const localApis = Apis.find().fetch();

      _.forEach(remoteApis, (remoteApi) => {
        // Get existing API Backend
        const existingLocalApiBackend = Apis.findOne({ id: remoteApi.id });

        // If API Backend doesn't exist in collection, insert into collection
        if (existingLocalApiBackend === undefined) {
          try {
            Apis.insert(remoteApi);
          } catch (error) {
            throw new Meteor.Error('Error inserting apiBackend(' + remoteApi.id + ') : ' + error);
          }
        }
      });

      _.forEach(localApis, (localApi) => {
        const existingRemoteApiBackend = _.find(remoteApis, (remoteApi) =>
          remoteApi.id === localApi.id);

        // If API Backend doesn't exist on API Umbrella, but locally, delete this API
        if (!existingRemoteApiBackend) {
          try {
            Apis.remove({ id: localApi.id });
          } catch (error) {
            throw new Meteor.Error('Error deleteing apiBackend(' + localApi.id + ') : ' + error);
          }
        }
      });
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },
  createApiBackendOnApiUmbrella (apiBackendForm) {
    // Create ApiUmbrellaWeb instance
    const umbrella = Meteor.call('createApiUmbrellaWeb');

    // Construct an API Backend object for API Umbrella with one 'api' key
    const constructedBackend = {
      api: apiBackendForm,
    };

    // Response object to be send back to client layer.
    const apiUmbrellaWebResponse = {
      result: {},
      http_status: 200,
      errors: {},
    };

    try {
      // Send the API Backend to API Umbrella's endpoint for creation in the backend
      apiUmbrellaWebResponse.result = umbrella.adminApi.v1.apiBackends.createApiBackend(constructedBackend);
    } catch (apiUmbrellaError) {
      // Set the errors object
      apiUmbrellaWebResponse.errors = { 'default': [apiUmbrellaError.message] };
      apiUmbrellaWebResponse.http_status = 422;
    }
    return apiUmbrellaWebResponse;
  },
  publishApiBackendOnApiUmbrella (apiBackendId) {
    // Create ApiUmbrellaWeb instance
    const umbrella = Meteor.call('createApiUmbrellaWeb');

    // Response object to be send back to client layer.
    const apiUmbrellaWebResponse = {
      result: {},
      http_status: 201,
      errors: {},
    };

    try {
      // Send the API Backend to API Umbrella's endpoint for creation in the backend
      apiUmbrellaWebResponse.result = umbrella.adminApi.v1.config.publishSingleApiBackend(apiBackendId);
    } catch (apiUmbrellaError) {
      // Set the errors object
      apiUmbrellaWebResponse.errors = { default: [apiUmbrellaError.message] };
      apiUmbrellaWebResponse.http_status = 422;
    }
    return apiUmbrellaWebResponse;
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
      apiUmbrellaWebResponse.errors = { 'default': [apiUmbrellaError.message] };
      apiUmbrellaWebResponse.http_status = 422;
    }
    return apiUmbrellaWebResponse;
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
      apiUmbrellaWebResponse.errors = { 'default': [apiUmbrellaError.message] };
      apiUmbrellaWebResponse.http_status = 422;
    }
    return apiUmbrellaWebResponse;
  },
});
