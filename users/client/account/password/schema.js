// Meteor packages imports
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const updatePasswordSchema = new SimpleSchema({
  old: {
    type: String,
    max: 50,
  },
  new: {
    type: String,
    min: 6,
    max: 20,
  },
  confirm: {
    type: String,
    min: 6,
    max: 20,
    // TODO: Resolve consistent-return
    // eslint-disable-next-line consistent-return
    custom () {
      // Make sure new password and password confirmation match
      if (this.value !== this.field('new').value) {
        return 'updatePassword_passwordsMismatch';
      }
    },
  },
});

updatePasswordSchema.i18n('schemas.updatePassword');

export default updatePasswordSchema;
