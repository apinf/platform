/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { AutoForm } from 'meteor/aldeed:autoform';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';

// Meteor contributed packages imports
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';

// Collection imports
import Apis from '/apinf_packages/apis/collection';

AutoForm.hooks({
  apiBacklogItemForm: {
    before: {
      insert (backlogItem) {
        // Get related API document
        const api = Apis.findOne({ slug: FlowRouter.getParam('slug') });

        // Attach API ID to backlog item
        backlogItem.apiBackendId = api._id;
        return backlogItem;
      },
    },
    beginSubmit () {
      // Disable form elements while submitting form
      $('[data-schema-key],button').attr('disabled', 'disabled');
    },
    endSubmit () {
      // Enable form elements after form submission
      $('[data-schema-key],button').removeAttr('disabled');
    },
    onSuccess (formType) {
      // Hide apiBacklogItemForm modal
      Modal.hide('apiBacklogItemForm');

      let message;

      // Backlog is created
      if (formType === 'insert') {
        message = TAPi18n.__('apiBacklogItemForm_message_backlogAdded');
      } else {
        // Backlog is changed
        message = TAPi18n.__('apiBacklogItemForm_message_backlogChanged');
      }

      // Display message text
      sAlert.success(message);
    },
  },
});
