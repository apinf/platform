Template.apiBackendRating.rendered = function () {
  // Get reference to template instance
  var instance = this;

  // Get API Backend ID from template instance
  var apiBackendId = instance.data._id;

  // Add the jQuery RateIt widget
  $("#rating-" + apiBackendId).rateit({max: 4});
};
