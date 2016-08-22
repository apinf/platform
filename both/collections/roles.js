Meteor.roles.schema = new SimpleSchema({
  name: {
    type: String
  }
});

Meteor.roles.attachSchema(Meteor.roles.schema);
