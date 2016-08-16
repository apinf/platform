import { Apis } from '/apis/collection/collection';

Meteor.methods({
  setAllApiBackendBookmarkCounts () {
    // Get all API Backends
    const apiBackends = Apis.find().fetch();

    // Update the average rating value for each API Backend
    apiBackends.forEach(function (apiBackend) {
      // Set average rating value for current API Backend
      apiBackend.setBookmarkCount();
    });
  }
});
