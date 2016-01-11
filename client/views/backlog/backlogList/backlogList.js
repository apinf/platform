Template.apiBacklogList.created = function () {

  // Get reference to tamplate instance
  var instance = this;

  // Get current API Backend Id from URL - (URL should look like "/api/:_id/backlog")
  instance.apiBackendId = Router.current().params._id;

  // Subscribe for apiBacklog publication & pass current API Backend Id
  instance.subscribe('apiBacklog', instance.apiBackendId);
};

Template.apiBacklogList.helpers({
  apiBacklogs: function () {

    // Get reference to template instance
    var instance = Template.instance();

    // Fetch all backlog items for a specific API Backend
    // Sort by priority value and created date
    var apiBacklogs = ApiBacklog.find({ apiBackendId: instance.apiBackendId }, {sort: {priority: -1, createdAt: -1}}).fetch();

    // Iterate through all backlog items
    _.each(apiBacklogs, function (backlog) {

      // Human-friendly timestamp
      backlog.relativeTime = moment(backlog.createdAt).fromNow();

      // Check if current user has posted current backlog item
      backlog.isOwner = Meteor.userId() == backlog.userId;

      // Check priority value & return specific CSS class for label to display
      switch (backlog.priority) {
        case 2:

          backlog.priorityColorClass = 'priority priority-high';

          break;
        case 1:

          backlog.priorityColorClass = 'priority priority-middle';

          break;
        case 0:

          backlog.priorityColorClass = 'priority priority-none';

          break;
      }

    });

    return apiBacklogs;
  },
  hasApiBacklogs: function () {

    // Get reference to a template instance
    var instance = Template.instance();

    // Check if current API Backend has any backlog items
    var hasApiBacklogItems = ApiBacklog.find({ apiBackendId: instance.apiBackendId }).count() > 0;

    return hasApiBacklogItems;
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
