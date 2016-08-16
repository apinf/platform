import { Apis } from '/apis/collection/collection';

Meteor.methods({
  currentUserCanViewApi (apiBackendId) {
    const apiBackend = Apis.findOne(apiBackendId);

    if (apiBackend && apiBackend.currentUserCanView() ) {
      // User is authorized to view this API
      console.log("current user can view")
      return  true;
    } else {
      console.log("current user cannot view")
      // User is NOT authorized to view this API
      return false;
    }
  }
});
