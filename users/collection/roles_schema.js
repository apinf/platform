// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Meteor contributed packages imports
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const RolesSchema = new SimpleSchema({
  name: {
    type: String,
  },
});

Meteor.roles.attachSchema(RolesSchema);
