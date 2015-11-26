Template.apiBackendForm.helpers({
  'formType': function () {
    // Get reference to current Router
    var router = Router.current();

    // Check for '_id' parameter in route
    if (router.params._id) {
      // Updating existing API Backend
      return 'update';
    } else {
      // Editing new API Backend
      return 'insert';
    }
  },
  'apiBackend': function () {
    // Get the current Router
    var router = Router.current();

    // Check router for _id parameter
    if (router.params._id) {
      // Get the API Backend ID
      var apiBackendId = router.params._id;

      // Get the API Backend
      var apiBackend = ApiBackends.findOne(apiBackendId);

      return apiBackend;
    }
  }
});

Template.apiBackendForm.created = function () {
  // Get reference to current Router
  var router = Router.current();

  // Get the API Backend ID from Router
  var apiBackendId = router.params._id;

  if (apiBackendId) {
    // Subscription to apiBackends collection
    this.subscribe('apiBackend', apiBackendId);
  }
};


Template.apiBackendForm.rendered = function () {
  // Hides blocks on template load
  $('#global-request-block, #sub-url-block, #advanced-block, #advanced-rewriting-block, #documentation-block').collapse({
    hide: true
  });

  // Toggles icon on hide and show events
  $('#global-request-block, #sub-url-block, #advanced-block, #advanced-rewriting-block, #documentation-block').on('shown.bs.collapse', function () {
    $(this).prev().find(".fa").removeClass("fa-chevron-right").addClass("fa-chevron-down");
  });
  $('#global-request-block, #sub-url-block, #advanced-block, #advanced-rewriting-block, #documentation-block').on('hidden.bs.collapse', function () {
    $(this).prev().find(".fa").removeClass("fa-chevron-down").addClass("fa-chevron-right");
  });
}
