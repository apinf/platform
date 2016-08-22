import { ApiBackends } from '/apis/collection/backend';

Meteor.methods({
  currentUserCanViewApi (apiBackendId) {
    const apiBackend = ApiBackends.findOne(apiBackendId);

    if (apiBackend && apiBackend.currentUserCanView() ) {
      // User is authorized to view this API
      return  true;
    } else {
      // User is NOT authorized to view this API
      return false;
    }
  }
});
