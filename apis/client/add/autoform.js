import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { AutoForm } from 'meteor/aldeed:autoform';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Organizations } from '/organizations/collection';
import { ApiMetadata } from '/metadata/collection';

AutoForm.hooks({
  addApiForm: {
    before: {
      insert (api) {
        // Get current user ID
        const userId = Meteor.userId();

        // Add current user as API manager
        api.managerIds = [userId];

        // Submit the form
        return api;
      },
    },
    after: {
      insert () {
        // Get API id
        const apiId = this.docId;
        // Get organization id
        const organizationId = this.insertDoc.organizationId;

        // Find the organization document
        const organization = Organizations.findOne(organizationId);

        // If organization was selected
        if (organization) {
          // Fill a object with organization information for metadata
          const metadataInformation = {
            apiBackendId: apiId,
            organization: {
              name: organization.name,
              description: organization.description,
            },
            contact: {
              name: organization.contact.person,
              phone: organization.contact.phone,
              email: organization.contact.email,
            },
          };
          // Create a new metadata document
          ApiMetadata.insert(metadataInformation);
        }
      },
    },
    onSuccess (formType, apiId) {
      // Redirect to newly added API
      FlowRouter.go('viewApi', { _id: apiId });

      // Get current user ID
      const userId = Meteor.userId();

      // Give user manager role
      Roles.addUsersToRoles(userId, 'manager');
    },
  },
});
