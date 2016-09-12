Schemas.RolesSchema = new SimpleSchema({
  name: {
    type: String
  }
});

Meteor.roles.attachSchema(Schemas.RolesSchema);
