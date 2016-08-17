import { ApiBackends } from '/apis/collection/backend';

Meteor.methods({
  checkFrontEndPrefixUnique (frontend_prefix) {
    const apiBackends = ApiBackends.find({"url_matches": { $elemMatch: {frontend_prefix} }});
    if (apiBackends) {
      return false
    } else {
      return true
    }
  }
});
