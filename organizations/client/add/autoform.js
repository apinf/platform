import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { AutoForm } from 'meteor/aldeed:autoform';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { sAlert } from 'meteor/juliancwirko:s-alert';
import { TAPi18n } from 'meteor/tap:i18n';
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';

AutoForm.hooks({
  organizationForm: {
    onSuccess () {
      // Hide organization form modal
      Modal.hide('organizationForm');

      // Get reference to template instance
      const instance = this;

      // Get organization URL slug
      const slug = instance.insertDoc.slug;

      // Redirect to newly added organization
      FlowRouter.go('organizationProfile', { slug });

      // Show success message once - reactive computation runs multiple times
      if (Tracker.firstRun) {
        // Create & show message about successfull inserting
        const message = TAPi18n.__('addOrganizationForm_successText');

        sAlert.success(message);
      }
    },
  },
});
