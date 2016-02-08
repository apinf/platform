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
  },
  'currentUserCanEditApi': function () {
    if (Meteor.user()) {
      // Get reference to template instance
      let instance = Template.instance();

      // Get reference to router
      let router = Router.current();

      // Get API Backend ID
      var backendId = router.params._id;

      // Make sure template subscriptions are ready
      if (instance.subscriptionsReady()) {
        // Get API Backend
        var apiBackend = ApiBackends.findOne(backendId);
        console.log(apiBackend);
        if (apiBackend) {
          // Check if current User can edit the API Backend
          var userCanEdit = apiBackend.currentUserCanEdit();

          if (userCanEdit) {
            // User is authorized to edit
            return true;
          }
        }
      }
    }
  },
  'editMode': function () {
    // Get the current Router
    var router = Router.current();

    // Check router for _id parameter
    if (router.params._id) {
      return true;
    } else {
      return false;
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
