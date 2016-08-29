import { Apis } from '/apis/collection';
import { Proxies } from '../../collection';
import { apiUmbrellaProxyIsValid } from '/lib/helperFunctions/validateSettings';
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

    } else {

      throw new Meteor.Error('Elasticsearch is not defined');
    }
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

    } else {

      throw new Meteor.Error('Api Umbrella Url is not defined');
    }
  },
  syncApiBackends () {

    // Check if apiUmbrellaWeb object exists
    if ( typeof apiUmbrellaWeb !== 'undefined' ) {

      // Get API Backends from API Umbrella instance
      const response = apiUmbrellaWeb.adminApi.v1.apiBackends.getApiBackends();
      const remoteApis = response.data.data;

      // Get all local API Backends
      const localApis = Apis.find().fetch();

      _.forEach(remoteApis, (remoteApi) => {

        // Get existing API Backend
        const existingLocalApiBackend = Apis.findOne({'id': remoteApi.id});

        // If API Backend doesn't exist in collection, insert into collection
        if (existingLocalApiBackend === undefined) {
          try {
            Apis.insert(remoteApi);
          } catch (error) {
            console.error("Error inserting apiBackend(" + remoteApi.id + ") : " + error);
          }
        };
      });

      _.forEach(localApis, (localApi) => {

        const existingRemoteApiBackend = _.find(remoteApis, (remoteApi) => {
          return remoteApi.id === localApi.id;
        });

        // If API Backend doesn't exist on API Umbrella, but locally, delete this API
        if (!existingRemoteApiBackend) {
          try {
            Apis.remove({'id': localApi.id});
          } catch (error) {
            console.error("Error deleteing apiBackend(" + localApi.id + ") : " + error);
          }
        }
      });
    }
  },
  createApiBackendOnApiUmbrella (apiBackendForm) {
    // Construct an API Backend object for API Umbrella with one 'api' key
    const constructedBackend = {
      'api': apiBackendForm
    };

    // Response object to be send back to client layer.
    let apiUmbrellaWebResponse = {
      result: {},
      http_status: 200,
      errors: {}
    };

    try {
      // Send the API Backend to API Umbrella's endpoint for creation in the backend
      apiUmbrellaWebResponse.result = apiUmbrellaWeb.adminApi.v1.apiBackends.createApiBackend(constructedBackend);
    } catch (apiUmbrellaError) {
      // Set the errors object
      apiUmbrellaWebResponse.errors = {'default': [apiUmbrellaError.message]};
      apiUmbrellaWebResponse.http_status = 422;
    }
    return apiUmbrellaWebResponse;
  },
  publishApiBackendOnApiUmbrella (apiBackendId) {
    // Response object to be send back to client layer.
    var apiUmbrellaWebResponse = {
      result: {},
      http_status: 201,
      errors: {}
    };

    try {
      // Send the API Backend to API Umbrella's endpoint for creation in the backend
      apiUmbrellaWebResponse.result = apiUmbrellaWeb.adminApi.v1.config.publishSingleApiBackend(apiBackendId);
    } catch (apiUmbrellaError) {
      // Set the errors object
      apiUmbrellaWebResponse.errors = {'default': [apiUmbrellaError.message]};
      apiUmbrellaWebResponse.http_status = 422;
    }
    return apiUmbrellaWebResponse;
  },
  updateApiBackendOnApiUmbrella (apiUmbrellaBackendId, apiBackend) {
    // Construct an API Backend object for API Umbrella with one 'api' key
    const constructedBackend = {
      'api': apiBackend
    };

    // Response object to be send back to client layer.
    let apiUmbrellaWebResponse = {
      result: {},
      http_status: 204,
      errors: {}
    };

    try {
      // Send the API Backend to API Umbrella's endpoint for creation in the backend
      apiUmbrellaWebResponse.result = apiUmbrellaWeb.adminApi.v1.apiBackends.updateApiBackend(apiUmbrellaBackendId, constructedBackend);
    } catch (apiUmbrellaError) {

      //set the errors object
      apiUmbrellaWebResponse.errors = {'default': [apiUmbrellaError.message]};
      apiUmbrellaWebResponse.http_status = 422;
    }
    return apiUmbrellaWebResponse;
  },
  deleteApiBackendOnApiUmbrella (apiUmbrellaApiId) {

    // Response object to be send back to client layer.
    var apiUmbrellaWebResponse = {
      result: {},
      http_status: 204,
      errors: {}
    };

    try {
      // Send the API Backend to API Umbrella's endpoint for deletion in the backend
      apiUmbrellaWebResponse.result = apiUmbrellaWeb.adminApi.v1.apiBackends.deleteApiBackend(apiUmbrellaApiId);
    } catch (apiUmbrellaError) {
      // Set the errors object
      apiUmbrellaWebResponse.errors = {'default': [apiUmbrellaError.message]};
      apiUmbrellaWebResponse.http_status = 422;
    }
    return apiUmbrellaWebResponse;
  },
  syncApiUmbrellaUsers () {

    // Check if apiUmbrellaWeb object exists
    if ( typeof apiUmbrellaWeb !== 'undefined' ) {

      // Get users from API Umbrella instance
      const response = apiUmbrellaWeb.adminApi.v1.apiUsers.getUsers();

      // Add each user to collection if not already there
      const apiUsers = response.data.data;

      _.forEach(apiUsers, function (apiUser) {
        // Get existing user
        var existingUser = ApiUmbrellaUsers.findOne({'id': apiUser.id});

        // If user doesn't exist in collection, insert into collection
        if (existingUser === undefined) {
          ApiUmbrellaUsers.insert(apiUser);
        }
      });
    }
  },
  createApiUmbrellaWeb () {

    const proxy = Proxies.findOne();

    // Check if API Umbrella Web settings are valid
    if (apiUmbrellaProxyIsValid(proxy)) {

      // Create config object for API Umbrella Web REST API
      const config = {
        baseUrl: proxy.apiUmbrella.url,
        apiKey: proxy.apiUmbrella.apiKey,
        authToken: proxy.apiUmbrella.authToken
      };

      // Check whether API Umbrella Web instance exists
      if ( typeof apiUmbrellaWeb === 'undefined' ) {

        try {
          // Create new API Umbrella Web object for REST calls
          apiUmbrellaWeb = new ApiUmbrellaWeb(config);

        } catch (error) {

          console.log(error);
        }
      } else {
        try {
          // Update existing API Umbrella Web object with new settings
          apiUmbrellaWeb.baseUrl = config.baseUrl;
          apiUmbrellaWeb.apiKey = config.apiKey;
          apiUmbrellaWeb.authToken = config.authToken;
        } catch (error) {
          console.log(error);
        }
      }
    }
  },
  syncApiUmbrellaAdmins () {

    if ( typeof apiUmbrellaWeb !== 'undefined' ) {

      // Get admin users from API Umbrella instance
      const response = apiUmbrellaWeb.adminApi.v1.adminUsers.getAdmins();

      // Add each admin user to collection if not already there
      const apiAdmins = response.data.data;

      _.forEach(apiAdmins, (apiAdmin) => {

        // Get existing admin user
        const existingAdminUser = ApiUmbrellaAdmins.findOne({'id': apiAdmin.id});

        // If admin user doesn't exist in collection, insert into collection
        if (existingAdminUser === undefined) {
          ApiUmbrellaAdmins.insert(apiAdmin);
        }
      });
    }
  },
  // Create API key & attach it for given user,
  // Might throw errors, catch on client callback
  createApiKeyForCurrentUser () {
    // Get logged in user
    const currentUser = Meteor.user();
    // Check currentUser exists
    if (currentUser) {
      // Check apiUmbrellaWeb global object exists
      if (apiUmbrellaWeb) {
        // Create API Umbrella user object with required fields
        const apiUmbrellaUserObj = {
          "user": {
            "email": currentUser.emails[0].address,
            "first_name": "-",
            "last_name": "-",
            "terms_and_conditions": true
          }
        };

        // Try to create user on API Umbrella
        try {
          // Add user on API Umbrella
          const response = apiUmbrellaWeb.adminApi.v1.apiUsers.createUser(apiUmbrellaUserObj);

          // Set fieldsToBeUpdated
          const fieldsToBeUpdated = {
            'apiUmbrellaUserId': response.data.user.id,
            'profile.apiKey': response.data.user.api_key
          };

          // Update currentUser
          Meteor.users.update({_id: currentUser._id}, {$set: fieldsToBeUpdated});

          // Insert full API Umbrella user object into API Umbrella Users collection
          ApiUmbrellaUsers.insert(response.data.user);
        } catch (error) {
          // Meteor Error (User create failed on Umbrella)
          throw new Meteor.Error(
            "umbrella-createuser-error",
            TAPi18n.__("umbrella_createuser_error")
          );
        }
      } else {
        // Meteor Error (apiUmbrellaWeb not defined)
        throw new Meteor.Error(
          "umbrella-notdefined-error",
          TAPi18n.__("umbrella_notdefined_error")

        );
      }
    } else {
      // Meteor Error (User not logged in)
      throw new Meteor.Error(
        "apinf-usernotloggedin-error",
        TAPi18n.__("apinf_usernotloggedin_error")
      );
    }
  }
});
