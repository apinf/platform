Template.apiBacklog.created = function () {

  // Get reference to template instance
  var instance = this;

  // Get current API Backend Id from URL - (URL should look like "/api/:_id/backlog")
  instance.apiBackendId = Router.current().params._id;

  // Subscribe to API Backlog items for this API Backend
  instance.subscribe("apiBacklogItems", instance.apiBackendId);

  // TODO: probably remove this sub later
  // Subscribe to API Backends managed by current user
  instance.subscribe("myManagedApis");
};

Template.apiBacklog.helpers({
  apiBackendId: function () {

    // Get reference to a template instance
    var instance = Template.instance();

    return instance.apiBackendId;
  },
  currentUserIsApiManager: function () {

    // Get reference to a template instance
    var instance = Template.instance();

    // Fetch current user's id
    var userId = Meteor.userId();

    var apiBackendId = instance.apiBackendId;

    // Find related API Backend that contains "managerIds" field
    var apiBackend = ApiBackends.findOne(apiBackendId, {fields: {managerIds: 1}});

    // Try - Catch wrapper here because Mongodb call above can return zero matches
    try {

      // Get managerIds array from API Backend document
      var managerIds = apiBackend.managerIds;

    } catch (err) {

      // If no related document found return false - API Backend does not have any managers listed
      return false;
    }

    // Check if an array of managerIds contain user id passed
    var isManager = _.contains(managerIds, userId);

    return isManager;
  }
});
