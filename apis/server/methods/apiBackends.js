import { ApiBackends } from '/apis/collection/backend';

Meteor.methods({
  currentUserCanViewApi (apiBackendId, route) {
    const apiBackend = ApiBackends.findOne(apiBackendId);

    if (apiBackend && apiBackend.currentUserCanView() ) {
      // User is authorized to view this API
      console.log("current user can view")
      return {route, authorized: true};
    } else {
      console.log("current user cannot view")
      // User is NOT authorized to view this API
      return {route, authorized: false};
    }
  }
});
