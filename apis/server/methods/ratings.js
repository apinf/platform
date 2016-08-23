import { Apis } from '/apis/collection/apis';

Meteor.methods({
  setAllApiBackendAverageRatings () {
    // Get all API Backends
    const apiBackends = Apis.find().fetch();

    // Update the average rating value for each API Backend
    apiBackends.forEach(function (apiBackend) {
      // Set average rating value for current API Backend
      apiBackend.setAverageRating();
    });
  },
  setApiBackendAverageRating (apiBackendId) {
    // Get API Backend
    const apiBackend = Apis.findOne(apiBackendId);

    // Update the API Backend bookmark count
    apiBackend.setAverageRating();
  }
});
