/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { AutoForm } from 'meteor/aldeed:autoform';
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';

AutoForm.hooks({
  apiDocumentationForm: {
    onSuccess () {
      Modal.hide('manageApiDocumentationModal');

      // Get success message translation
      const message = TAPi18n.__('manageApiDocumentationModal_LinkField_Updated_Message');

      // Alert user of success
      sAlert.success(message);
    },
  },
});
