Template.apiBacklogList.created = function () {

  var intance = this;

  // Subscribe for all feedback for this API Backend
  intance.subscribe('allApiBacklogs');
};

Template.apiBacklogList.rendered = function () {

};

Template.apiBacklogList.helpers({
  apiBacklogs: function () {
    return ApiBacklog.find();
  }
});
