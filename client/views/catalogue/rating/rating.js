Template.apiBackendRating.rendered = function () {
  // Get reference to template instance
  var instance = this;

  // Get API Backend ID from template instance
  var apiBackendId = instance.data._id;

  // Subscribe to rating for current API Backend
  instance.subscribe('myApiBackendRating', apiBackendId);

  // Add the jQuery RateIt widget
  $("#rating-" + apiBackendId).rateit({
    max: 4,
    step: 1,
    resetable: false
  });
};

Template.apiBackendRating.events({
  "click .rateit": function (event, instance) {
    // Get API Backend ID from template data context
    var apiBackendId = instance.data._id;

    // Get rating from template based on API Backend ID
    var rating = $("#rating-" + apiBackendId).rateit('value');

    // Get current user ID
    var userId = Meteor.userId();

    // Create an rating object with user ID, API Backend ID, and rating
    var apiBackendRating = {
      apiBackendId: apiBackendId,
      userId: userId,
      rating: rating
    };

    // Check if user has previously rated API Backend
    var previousRating = ApiBackendRatings.findOne({
      apiBackendId: apiBackendId,
      userId: userId
    });

    // If previous rating exists
    if (previousRating) {
      // Update the existing rating
      ApiBackendRatings.update(previousRating._id, {$set: apiBackendRating });
    } else {
      console.log('new');
      // Otherwise, create a new rating
      ApiBackendRatings.insert(apiBackendRating);
    }
  }
});
