import { Meteor } from 'meteor/meteor';
import { AutoForm } from 'meteor/aldeed:autoform';
import { FlowRouter } from 'meteor/kadira:flow-router';

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
    },
  },
});
