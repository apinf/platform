Template.deleteApiBackend.created = function() {

  // get reference to current router
  let router = Router.current();

  // get Api backend ID from router parameters
  let apiBackendId = router.params._id;

  if (apiBackendId) {
    //subscribe to apiBackends collection
    this.subscribe('apiBackend', apiBackendId);
  }
};

Template.deleteApiBackend.helpers({

  'currentUserCanDeleteApi': function() {

    if (Meteor.user()) {

      // get reference to current template
      let instance = Template.instance();

      // get reference to current router
      let router = Router.current();
      
      // if subscriptions for current template are ready
      if (instance.subscriptionsReady()) {

        // get API backend with ID in router parameter 
        let apiBackend = ApiBackends.findOne(router.params._id);

        if (apiBackend) {
          // check if current user can delete the API backend
          var userCanDelete = apiBackend.currentUserCanEdit();
        }

        if (userCanDelete) {
          // user is authorized to delete
          return true;
        }
      }
    }
  },

  'apiBackend': function() {
    // Get reference to current router
    let router = Router.current();

    // if ID in URL is not null, return API backend having that ID
    if (router.params._id) {
      let apiBackend = ApiBackends.findOne(router.params._id);
      return apiBackend;
    }
  }
});











