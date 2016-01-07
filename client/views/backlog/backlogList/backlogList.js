Template.apiBacklogList.created = function () {

  var intance = this;

  // Subscribe for all feedback for this API Backend
  intance.subscribe('allApiBacklogs');
};

Template.apiBacklogList.rendered = function () {

};

Template.apiBacklogList.helpers({
  apiBacklogs: function () {

    var apiBacklogs = ApiBacklog.find({}, {sort: {priority: -1, createdAt: -1}}).fetch();

    _.each(apiBacklogs, function (backlog) {

      backlog.relativeTime = moment(backlog.createdAt).fromNow();

      backlog.isOwner = Meteor.userId() == backlog.userId;

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
    return ApiBacklog.find().count() > 0;
  }
});


Template.apiBacklogList.events({
  // Delete backlog item
  'click .delete-backlog': function (event) {
    //Meteor.call('deleteBacklogItem', this._id);
    ApiBacklog.remove(this._id);
  }
});
