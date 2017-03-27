/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { AutoForm } from 'meteor/aldeed:autoform';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';

// Collection imports
import Apis from '/apis/collection';

AutoForm.hooks({
  feedbackForm: {
    before: {
      insert (feedback) {
        // Get related API document
        const api = Apis.findOne({ slug: FlowRouter.getParam('slug') });

        // Attach API ID to feedback item
        feedback.apiBackendId = api._id;

        return feedback;
      },
    },
    onSuccess () {
      // Get success message translation
      const message = TAPi18n.__('feedbackForm_successMessage');

      // Alert user of success
      sAlert.success(message);

      Modal.hide('feedbackForm');
    },
  },
});
