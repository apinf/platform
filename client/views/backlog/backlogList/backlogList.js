Template.apiBacklogList.created = function () {

  var intance = this;

  // Subscribe for all feedback for this API Backend
  intance.subscribe('allApiBacklogs');
};

Template.apiBacklogList.rendered = function () {

};

Template.apiBacklogList.helpers({
  apiBacklogs: function () {

    var apiBacklogs = ApiBacklog.find().fetch();

    _.each(apiBacklogs, function (backlog) {
      backlog.relativeTime = moment(backlog.createdAt).fromNow();
    });

    return apiBacklogs;
  },
  hasApiBacklogs: function () {
    return ApiBacklog.find().count() > 0;
  }
});
