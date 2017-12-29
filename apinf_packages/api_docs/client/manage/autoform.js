/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Session } from 'meteor/session';

// Meteor contributed packages imports
import { AutoForm } from 'meteor/aldeed:autoform';
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';

AutoForm.hooks({
  apiDocumentationForm: {
    before: {
      insert (doc) {
        // Get ID of uploaded file
        const fileId = Session.get('fileId');

        // If selected option is File and File is uploaded
        if (doc.type === 'file' && fileId) {
          // Save ID
          doc.fileId = fileId;
        }
        const getLinks = Session.get('links');
        if (getLinks) {
          doc.otherUrl = getLinks;
        }

        // Return data
        return doc;
      },
      update (doc) {
        // Get ID of uploaded file
        const fileId = Session.get('fileId');

        // If selected option is File and File is uploaded
        if (doc.$set.type === 'file' && fileId) {
          // Save ID
          doc.$set.fileId = fileId;
        }
        doc.$set.otherUrl = Session.get('links');
        // Return data
        return doc;
      },
    },
    onSuccess () {
      Modal.hide('manageApiDocumentationModal');

      // Get success message translation
      const message = TAPi18n.__('manageApiDocumentationModal_LinkField_Updated_Message');

      // Alert user of success
      sAlert.success(message);
    },
  },
});
