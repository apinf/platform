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

      // Check if current user has posted current backlog item
      backlog.currentUserIsOwner = Meteor.userId() === backlog.userId;

    });

    return apiBacklogs;
  },
  relativeTimeStamp: function (givenTimeStamp) {

    return moment(givenTimeStamp).fromNow();

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
  currentUserCanEditBacklog: function() {
    /*
     API Backlog shares permissions with the API Backend
     Make sure user can edit API Backend before allowing Metadata permissions
    */

    // Get current API backend ID
    var apiBackendId = this.apiBackend._id;

    // Find related API Backend that contains "managerIds" field
    var apiBackend = ApiBackends.findOne(apiBackendId, {fields: {managerIds: 1}});

    // Check if current user can edit API Backend
    return apiBackend.currentUserCanEdit();
  }
});
