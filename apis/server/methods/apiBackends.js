import { Apis } from '/apis/collection';

Meteor.methods({
  checkIfApiExists (apiId) {
    // Placeholder for API check
    let apiExists;

    // Check for API
    const api = Apis.findOne(apiId);

    // Check for existance of API
    if (api) {
      apiExists = true;
    } else {
      apiExists = false;
    }

    return apiExists;
  }
});
