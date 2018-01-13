/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// Collection imports
import Apis from '/apinf_packages/apis/collection';
import ApiDocs from '/apinf_packages/api_docs/collection';

Meteor.methods({
  importApiConfigs (jsonObj) {
    // Check if jsonObj is an Object
    check(jsonObj, Object);

    // initial status obj
    const status = {
      isSuccessful: false,
      message: '',
    };

    // Get user id
    const userId = Meteor.userId();

    // Check if user is logged
    if (!userId) {
      status.message = 'You must be logged to import an API';
      return status;
    }

    // checks if file was passed
    if (jsonObj) {
      // Api object
      const api = {
        name: jsonObj.name,
        description: jsonObj.description,
        url: jsonObj.url,
        lifecycleStatus: jsonObj.lifecycleStatus,
        managerIds: [userId],
      };

      // Validate the api
      Apis.schema.validate(api);

      // additional error handling
      try {
        // Check unique api name
        const count = Apis.find({ name: jsonObj.name }).count();

        if (count === 0) {
          // Insert the API and get the id
          const newApiId = Apis.insert(api);

          // Get the new api
          const newApi = Apis.findOne({ _id: newApiId });

          // Set message
          status.isSuccessful = true;
          status.message = 'API config has been successfully imported.';

          // set the slug to do the redirect
          status.slug = newApi.slug;
          status.apiId = newApiId;
        } else {
          status.message = 'API name must be unique';
        }
      } catch (e) {
        status.message = 'Error while import API';
      }
    } else {
      status.message = 'Config is not found.';
    }
    return status;
  },
  importApiByDocument (url, lifecycleStatus, query) {
    check(url, String);
    check(lifecycleStatus, String);
    check(query, Object);

    // Parse provided file as OpenAPI file
    const result = Meteor.call('parsedSwaggerDocument', url);

    // Incorrect result if "info" part doesn't exist
    if (!result.info) {
      // Then provided file is invalid
      throw new Meteor.Error('Swagger schema validation failed.');
    }

    // HTTP protocol by default
    let urlSchema = 'http';

    // Make sure a user adds schemes in specification
    if (result.schemes && result.schemes.length > 0) {
      // Use provided schema
      urlSchema = result.schemes[0];
    }
    const description = result.info.description.length <= 1000 ?
      result.info.description : '';

    // Create config file
    const apiData = {
      name: result.info.title,
      description,
      url: `${urlSchema}://${result.host}`,
    };

    // Save value of lifecycleStatus if it isn't empty
    if (lifecycleStatus) {
      apiData.lifecycleStatus = lifecycleStatus;
    }

    // Insert a new API using config
    const addedApi = Meteor.call('importApiConfigs', apiData);

    // If API is added successfully
    if (addedApi.isSuccessful) {
      query.apiId = addedApi.apiId;
      // Insert OpenAPI specification in ApiDocs collection
      ApiDocs.insert(query);
    }

    return addedApi;
  },
});
