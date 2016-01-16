Template.apiBacklogList.created = function () {

  // Get reference to tamplate instance
  var instance = this;

  // Get current API Backend Id from URL - (URL should look like "/api/:_id/backlog")
  instance.apiBackendId = Router.current().params._id;

};

Template.apiBacklogList.helpers({
  apiBacklogItems: function () {

    // Get reference to template instance
    var instance = Template.instance();

    // Fetch all backlog items for a specific API Backend
    // Sort by priority value and created date
    var apiBacklogs = ApiBacklogItems.find({ apiBackendId: instance.apiBackendId }, {sort: {priority: -1, createdAt: -1}}).fetch();

    // Iterate through all backlog items
    _.each(apiBacklogs, function (backlog) {

      // Human-friendly timestamp
      backlog.relativeTime = moment(backlog.createdAt).fromNow();

      // Check if current user has posted current backlog item
      backlog.currentUserIsOwner = Meteor.userId() == backlog.userId;

    });

    return apiBacklogs;
  },
  itemPriorityClass: function (priority) {

    var priorityClass = "";

    // Check priority value & return specific CSS class for label to display
    switch (priority) {
      case 2:

        priorityClass = 'priority priority-high';

        break;
      case 1:

        priorityClass = 'priority priority-middle';

        break;
      case 0:

        priorityClass = 'priority priority-low';

        break;
    }

    return priorityClass;

  },
  currentUserIsApiManager: function () {

    // Get reference to a template instance
    var instance = Template.instance();

    // Ger current user's id
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
