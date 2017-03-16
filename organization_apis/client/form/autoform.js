/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { AutoForm } from 'meteor/aldeed:autoform';
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';

AutoForm.hooks({
  organizationApisForm: {
    onError (formType, error) {
      // Show error message to user
      sAlert.error(error.message);
    },
    onSuccess () {
      // Create & show message on success
      const message = TAPi18n.__('organizationApisForm_successText');

      // Show success message to user
      sAlert.success(message);

      // Dismiss connect API modal, if connecting API to Organization via modal
      Modal.hide('connectApiToOrganizationModal');
    },
  },
});
