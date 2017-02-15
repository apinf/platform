// Collection imports
import Apis from '/apis/collection';

Meteor.methods({
  checkIfApiExists (apiId) {
    // Make sure apiId is a string
    check(apiId, String);

    // Look for API
    const api = Apis.findOne(apiId);

    // Return true if API exists, false if undefined
    return (api);
  },
});
