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
  }
});
