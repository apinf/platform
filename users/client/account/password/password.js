// Meteor packages imports
import { Template } from 'meteor/templating';

// APINF imports
import updatePasswordSchema from './schema';

Template.updatePassword.helpers({
  updatePasswordSchema () {
    return updatePasswordSchema;
  },
});
