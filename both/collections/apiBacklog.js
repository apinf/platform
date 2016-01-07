ApiBacklog = new Mongo.Collection("apiBacklog");

ApiBacklog.attachSchema(new SimpleSchema({
  text: {
    type: String,
    label: "Text",
    max: 1000,
    autoform: {
      rows: 5,
      placeholder: 'Type backlog title/description here'
    }
  },
  priority: {
    type: String,
    label: 'Priority',
    allowedValues: ['Critical', 'High', 'Middle', 'Low', 'None'],
    autoform: {
      options: [
        { label: "Critical", value: "Critical" },
        { label: "High", value: "High" },
        { label: "Middle", value: "Middle" },
        { label: "Low", value: "Low" },
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
    return true;
  },
  update: function (userId, backlog) {
    return true;
  },
  remove: function (userId, backlog) {
    return true;
  }
});
