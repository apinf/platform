/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// Collection imports
import Apis from '/packages/apis/collection';

// validation function
function apiIsValid (jsonObj) {
  // initial status obj
  const status = {
    isValid: false,
    message: '',
  };

  // iterates through object keys and checks if required fields are provided
  // otherwise returns a message with missing field

  if (Object.prototype.hasOwnProperty.call(jsonObj, '_id')) {
    status.message += "'_id' field is not allowed to import.";
  } else {
    if (Object.prototype.hasOwnProperty.call(jsonObj, 'name')) {
      if (Object.prototype.hasOwnProperty.call(jsonObj, 'backend_host')) {
        if (Object.prototype.hasOwnProperty.call(jsonObj, 'backend_protocol')) {
          if (Object.prototype.hasOwnProperty.call(jsonObj, 'frontend_host')) {
            if (Object.prototype.hasOwnProperty.call(jsonObj, 'balance_algorithm')) {
              status.isValid = true;
            } else {
              status.message += "'balance_algorithm'";
            }
          } else {
            status.message += "'frontend_host'";
          }
        } else {
          status.message += "'backend_protocol'";
        }
      } else {
        status.message += "'backend_host'";
      }
    } else {
      status.message += "'name'";
    }
    status.message += ' field is required.';
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
          const newApiBackend = Apis.insert(jsonObj);

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
