import { Apis } from '/apis/collection/collection';

Meteor.methods({
  currentUserCanViewApi (apiBackendId) {
    const apiBackend = Apis.findOne(apiBackendId);

    if (apiBackend && apiBackend.currentUserCanView() ) {
      // User is authorized to view this API
      return  true;
    } else {
      // User is NOT authorized to view this API
      return false;
    }
  }
});
