import { ApiBackends } from '/apis/collection/backend';
import _ from 'lodash';

Meteor.methods({
  "syncApiBackends":function () {

    // Check if apiUmbrellaWeb object exists
    if ( typeof apiUmbrellaWeb !== 'undefined' ) {

      // Get API Backends from API Umbrella instance
      const response = apiUmbrellaWeb.adminApi.v1.apiBackends.getApiBackends();
      const remoteApis = response.data.data;

      // Get all local API Backends
      const localApis = ApiBackends.find().fetch();

      _.forEach(remoteApis, (remoteApi) => {

        // Get existing API Backend
        const existingApiBackend = ApiBackends.findOne({'id': remoteApi.id});

        // If API Backend doesn't exist in collection, insert into collection
        if (existingApiBackend === undefined) {
          try {
            ApiBackends.insert(remoteApi);
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
            ApiBackends.remove({'id': localApi.id});
          } catch (error) {
            console.error("Error deleteing apiBackend(" + localApi.id + ") : " + error);
          }
        }
      });
    }
  },
  createApiBackendOnApiUmbrella: function (apiBackendForm) {
    // Construct an API Backend object for API Umbrella with one 'api' key
    var constructedBackend = {
      "api": apiBackendForm
    };

    // Response object to be send back to client layer.
    var apiUmbrellaWebResponse = {
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
  publishApiBackendOnApiUmbrella: function (apiBackendId) {
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
  updateApiBackendOnApiUmbrella: function (apiUmbrellaBackendId, apiBackend) {
    // Construct an API Backend object for API Umbrella with one 'api' key
    var constructedBackend = {
      "api": apiBackend
    };

    // Response object to be send back to client layer.
    var apiUmbrellaWebResponse = {
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

  deleteApiBackendOnApiUmbrella: function (apiUmbrellaApiId) {

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
