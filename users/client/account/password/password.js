import { Template } from 'meteor/templating';
import updatePasswordSchema from './schema';

Template.updatePassword.helpers({
  updatePasswordSchema () {
    return updatePasswordSchema;
  },
});
