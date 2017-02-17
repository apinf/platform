import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const RolesSchema = new SimpleSchema({
  name: {
    type: String,
  },
});

Meteor.roles.attachSchema(RolesSchema);
