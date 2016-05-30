ApiBackends.helpers({
  'getRating': function () {
    // Get API Backend ID
    apiBackendId = this._id;

    // Check if user is logged in
    if (Meteor.userId()) {
      // Check if user has rated API Backend
      var userRating = ApiBackendRatings.findOne({
        userId: Meteor.userId(),
        apiBackendId: apiBackendId
      });

      if (userRating) {
        return userRating.rating;
      }
    }

    // Otherwise, get average rating

    // Fetch all ratings
    var apiBackendRatings = ApiBackendRatings.find({
      apiBackendId: apiBackendId
    }).fetch();

    // If ratings exist
    if (apiBackendRatings) {
      // Create array containing only rating values
      var apiBackendRatingsArray = _.map(apiBackendRatings, function (rating) {
        // get only the rating value; omit User ID and API Backend ID fields
        return rating.rating;
      });

      // Get the average (mean) value for API Backend ratings
      var apiBackendRatingsAverage = ss.mean(apiBackendRatingsArray);

      return apiBackendRatingsAverage;
    }
  },
  currentUserCanEdit: function() {
    // Get current userId
    var userId = Meteor.userId();

    // Check that user is logged in
    if( userId ) {
      // Check if user is API manager
      var isManager = _.contains(this.managerIds, userId);

      if (isManager) {
        return true;
      }

      // Check if user is administrator
      var isAdmin = Roles.userIsInRole(userId, ['admin']);

      if (isAdmin) {
        return true;
      }
    } else {
      // User is not logged in
      return false;
    }
  },
  currentUserIsManager: function () {
    // Get current User ID
    var userId = Meteor.userId();

    // Get Manager IDs array from API Backend document
    var managerIds = this.managerIds;

    // Check if User ID is in Manager IDs array
    var isManager = _.contains(managerIds, userId);

    return isManager;
  }
});
