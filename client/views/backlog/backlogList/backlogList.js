Template.apiBacklogList.created = function () {

  var instance = this;

  instance.apiBackendId = Router.current().params._id;

  // Subscribe for all feedback for this API Backend
  instance.subscribe('apiBacklog', instance.apiBackendId);
};

Template.apiBacklogList.rendered = function () {

};

Template.apiBacklogList.helpers({
  apiBacklogs: function () {

    var instance = Template.instance();

    var apiBacklogs = ApiBacklog.find({ apiBackendId: instance.apiBackendId }, {sort: {priority: -1, createdAt: -1}}).fetch();

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

    var instance = Template.instance();

    return ApiBacklog.find({ apiBackendId: instance.apiBackendId }).count() > 0;
  }
});
