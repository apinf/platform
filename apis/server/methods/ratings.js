Meteor.methods({
  setAllApiBackendAverageRatings () {
    // Get all API Backends
    const apiBackends = ApiBackends.find().fetch();

    // Update the average rating value for each API Backend
    apiBackends.forEach(function (apiBackend) {
      // Set average rating value for current API Backend
      apiBackend.setAverageRating();
    });
  },
  setApiBackendAverageRating (apiBackendId) {
    // Get API Backend
    const apiBackend = ApiBackends.findOne(apiBackendId);

    // Update the API Backend bookmark count
    apiBackend.setAverageRating();
  }
});
