import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { AutoForm } from 'meteor/aldeed:autoform';
import { FlowRouter } from 'meteor/kadira:flow-router';

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
