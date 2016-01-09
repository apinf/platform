Template.apiBacklog.created = function () {

  var instance = this;

  instance.apiBackendId = Router.current().params._id;
};


Template.apiBacklog.rendered = function() {

};


Template.apiBacklog.helpers({
  currentUserIsApiManager: function () {

    var instance = Template.instance();

    var userId = Meteor.userId();

    var apiBackendId = instance.apiBackendId;

    var apiBackend = ApiBackends.findOne(apiBackendId, {fields: {managerIds: 1}});

    try {

      var managerId = apiBackend.managerIds;

    } catch (err) {

      return false;
    }

    var isManager = _.contains(managerId, userId);

    return isManager;
  }
});
