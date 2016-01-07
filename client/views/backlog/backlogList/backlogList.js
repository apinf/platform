Template.apiBacklogList.created = function () {

  var intance = this;

  // Subscribe for all feedback for this API Backend
  intance.subscribe('allApiBacklogs');
};

Template.apiBacklogList.rendered = function () {

};

Template.apiBacklogList.helpers({
  apiBacklogs: function () {

    var apiBacklogs = ApiBacklog.find({}, {sort: {createdAt: -1}}).fetch();

    _.each(apiBacklogs, function (backlog) {

      backlog.relativeTime = moment(backlog.createdAt).fromNow();

      switch (backlog.priority) {
        case 'Critical':

          backlog.priorityColorClass = 'label label-danger';

          break;
        case 'High':

          backlog.priorityColorClass = 'label label-warning';

          break;
        case 'Middle':

          backlog.priorityColorClass = 'label label-primary';

          break;
        case 'Low':

          backlog.priorityColorClass = 'label label-default';

          break;
        case 'None':

          backlog.priorityColorClass = 'label label-default';

          break;
        default:

          backlog.priorityColorClass = 'label label-default';

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
