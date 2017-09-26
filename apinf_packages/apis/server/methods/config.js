/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// Collection imports
import Apis from '/apinf_packages/apis/collection';

// validation function
function apiIsValid (jsonObj) {
  const status = {
    isValid: false,
    message: '',
  };
  const possiblesLifecycleStatus = ['design', 'develop', 'testing', 'production', 'deprecated'];

  // Basic check fields:
  if (!Object.prototype.hasOwnProperty.call(jsonObj, 'name')) {
    status.message = 'mame is a required field';
  } else if (!Object.prototype.hasOwnProperty.call(jsonObj, 'description')) {
    status.message = 'description is a required field';
  } else if (!Object.prototype.hasOwnProperty.call(jsonObj, 'url')) {
    status.message = 'url is a required field';
  } else if (!Object.prototype.hasOwnProperty.call(jsonObj, 'lifecycleStatus')) {
    status.message = 'lifecycleStatus is a required field';
  } else if (possiblesLifecycleStatus.indexOf(jsonObj.lifecycleStatus) === -1) {
    status.message = `Invalid lifecycleStatus, please use: ${possiblesLifecycleStatus.join(', ')}`;
  } else {
    status.isValid = true;
  }

  return status;
}

Meteor.methods({
  importApiConfigs (jsonObj) {
    // Check if jsonObj is an Object
    check(jsonObj, Object);

    // initial status obj
    const status = {
      isSuccessful: false,
      message: '',
    };

    // checks if file was passed
    if (jsonObj) {
      // parses json object
      const parsedJson = apiIsValid(jsonObj);

      // checks if valid
      if (parsedJson.isValid) {
        // additional error handling
        try {
          const newApiBackend = Apis.insert({
            name: jsonObj.name,
            description: jsonObj.description,
            url: jsonObj.url,
            lifecycleStatus: jsonObj.lifecycleStatus,
          });

          status.isSuccessful = true;
          status.message = 'API config has been successfully imported.';

          // gets new backend's id and passes it to client to be able to redirect then
          status.newBackendId = newApiBackend;
        } catch (e) {
          status.message = JSON.stringify(e);
        }
      } else {
        // if validation check failed - passing message returned by validation function
        status.message = parsedJson.message;
      }
    } else {
      status.message = 'Config is not found.';
    }
    return status;
  },
});
