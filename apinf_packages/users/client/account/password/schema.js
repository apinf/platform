/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { TAPi18n } from 'meteor/tap:i18n';

SimpleSchema.messages({
  updatePassword_passwordsMismatch: TAPi18n.__('passwordsMismatch'),
});

const updatePasswordSchema = new SimpleSchema({
  old: {
    type: String,
  },
  new: {
    type: String,
    min: 6,
  },
  confirm: {
    type: String,
    min: 6,
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
