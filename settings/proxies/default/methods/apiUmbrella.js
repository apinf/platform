import { Apis } from '/apis/collection';
import { Proxies } from '../../collection';
import _ from 'lodash';

Meteor.methods({
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
  }
});
