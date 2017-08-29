/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Meteor contributed packages imports
import { AutoForm } from 'meteor/aldeed:autoform';
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';

AutoForm.addHooks('insertApiFlag', {
  onSuccess (formType) {
    // Hide modal
    Modal.hide('flagApiModal');

    // Checks formtype
    if (formType === 'insert') {
      // Get insert message translation
      const message = TAPi18n.__('flagApiModal_removeApiFlag_insertMessage');

      // Show message to a user
      sAlert.success(message);
    } else if (formType === 'update') {
      // Get update message translation
      const message = TAPi18n.__('flagApiModal_removeApiFlag_updateMessage');

      // Show message to a user
      sAlert.success(message);
    }
  },
  onError (formType, error) {
    // Throw an error if one has been chatched
    return new Meteor.Error(error);
  },
});
