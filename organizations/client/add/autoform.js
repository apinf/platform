import { Meteor } from 'meteor/meteor';
import { AutoForm } from 'meteor/aldeed:autoform';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { sAlert } from 'meteor/juliancwirko:s-alert';
import { TAPi18n } from 'meteor/tap:i18n';

AutoForm.hooks({
  addOrganizationForm: {
    before: {
      insert (organization) {
        // Get current user ID
        const userId = Meteor.userId();

        // Add current user as organization manager
        organization.managerIds = [userId];

        // Submit the form
        return organization;
      },
    },
    onSuccess () {
      // Get reference to template instance
      const instance = this;

      // Get slug
      const slug = instance.insertDoc.slug;

      // Redirect to newly added organization
      FlowRouter.go('organizationProfile', { slug });

      // Create & show message about successfull inserting
      const message = TAPi18n.__('addOrganizationForm_successText');
      sAlert.success(message);

    },
  },
});
