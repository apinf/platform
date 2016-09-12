const RolesSchema = new SimpleSchema({
  name: {
    type: String,
  },
});

Meteor.roles.attachSchema(RolesSchema);
