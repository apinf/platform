/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Meteor contributed packages imports
import { AutoForm } from 'meteor/aldeed:autoform';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';

AutoForm.hooks({
  organizationForm: {
    before: {
      insert (organization) {
        // Get current user ID
        const userId = Meteor.userId();

        // Add current user as Organization manager & creater
        organization.managerIds = [userId];
        organization.createdBy = userId;

        // Submit the form
        return organization;
      },
    },
    onSuccess (formType) {
      // Hide organization form modal
      Modal.hide('organizationForm');

      // Get success message translation
      const message = TAPi18n.__('organizationForm_successText');

      // Show success message to user,
      // make sure message shows if route changes
      sAlert.success(message, { onRouteClose: false });

      // Check if form is in insert mode
      if (formType === 'insert') {
        // Get reference to template instance
        const instance = this;

        // Get organization URL slug
        const slug = instance.insertDoc.slug;

        // Redirect to newly added organization
        FlowRouter.go('organizationProfile', { slug });
      } else if (formType === 'update') {
        // Get reference to template instance
        const instance = this;

        // Redirect to new organization page, if slug changes
        if (instance.updateDoc.$set.slug) {
          // Get organization URL slug
          const slug = instance.updateDoc.$set.slug;

          // Redirect to newly added organization
          FlowRouter.go('organizationProfile', { slug });
        }
      }
    },
  },
});
