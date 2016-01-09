ApiBacklog = new Mongo.Collection("apiBacklog");

ApiBacklog.attachSchema(new SimpleSchema({
  title: {
    type: String,
    label: "Title",
    max: 100,
    autoform: {
      placeholder: "Title"
    }
  },
  details: {
    type: String,
    label: "Details",
    max: 1000,
    autoform: {
      rows: 5,
      placeholder: "Description"
    },
    optional: true
  },
  priority: {
    type: Number,
    label: 'Priority',
    allowedValues: [2, 1, 0],
    min:0,
    max:2,
    autoform: {
      options: [
        { label: "High", value: 2 },
        { label: "Middle", value: 1 },
        { label: "None", value: 0 }
      ]
    }
  },
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    autoValue: function () {
      return Meteor.userId();
    }
  },
  apiBackendId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true
  },
  createdAt: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date()};
      } else {
        this.unset();
      }
    }
  },
  updatedAt: {
    type: Date,
    optional: true
  }
}));

ApiBacklog.allow({
  insert: function (userId, backlog) {

    return userIsManager(userId, backlog);
  },
  update: function (userId, backlog) {

    return userIsManager(userId, backlog) && (userId === backlog.userId);
  },
  remove: function (userId, backlog) {

    return userIsManager(userId, backlog) && (userId === backlog.userId);
  }
});


var userIsManager = function (userId, backlog) {

  var apiBackendId = backlog.apiBackendId;

  var apiBackend = ApiBackends.findOne(apiBackendId, {fields: {managerIds: 1}});

  var managerId = apiBackend.managerIds;

  var isManager = _.contains(managerId, userId);

  console.log("User is manager - ", isManager);

  return isManager;
};
