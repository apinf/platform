Template.editApiBackend.created = function () {
  // Get reference to current Router
  var router = Router.current();

  // Get the API Backend ID from Router
  var apiBackendId = router.params._id;

  if (apiBackendId) {
    // Subscription to apiBackends collection
    this.subscribe('apiBackend', apiBackendId);
  }
};

Template.editApiBackend.helpers({
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
