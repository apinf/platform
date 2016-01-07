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
    type: String,
    label: 'Priority',
    allowedValues: ['High', 'Middle', 'None'],
    autoform: {
      options: [
        { label: "High", value: "High" },
        { label: "Middle", value: "Middle" },
        { label: "None", value: "None" }
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
    return Roles.userIsInRole(Meteor.user(), ['admin']);
  },
  update: function (userId, backlog) {
    return userId === backlog.userId;
  },
  remove: function (userId, backlog) {
    return userId === backlog.userId;
  }
});
