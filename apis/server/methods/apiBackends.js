import { Apis } from '/apis/collection';

Meteor.methods({
  checkIfApiExists (apiId) {
    // Check for API
    const api = Apis.findOne(apiId);

    // Return true if API exists, false if undefined
    return (api);
  },
});
