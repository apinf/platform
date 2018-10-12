/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Meteor contributed packages imports
import { AutoForm } from 'meteor/aldeed:autoform';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Roles } from 'meteor/alanning:roles';
import { sAlert } from 'meteor/juliancwirko:s-alert';

AutoForm.hooks({
  addApiForm: {
    formToDoc: (doc) => {
      const protocol1 = 'https://';
      const protocol2 = 'http://';
      if (doc.url.substring(0, 8) === protocol1) {
        return doc;
      } else if (doc.url.substring(0, 7) === protocol2) {
        return doc;
      } else if (doc.url.substring(0, 8) !== protocol1) {
        doc.url = protocol1 + doc.url;
        return doc;
      }
      return doc;
    },

    before: {
      insert (api) {
        // Get current user ID
        const userId = Meteor.userId();

        // Add current user as API manager
        api.managerIds = [userId];

        // Add current user as API created by
        api.created_by = userId;

        // Submit the form
        return api;
      },
    },
    onSuccess (formType, apiId) {
      // Add slug to api collection
      Meteor.call('updateApiBySlug', { _id: apiId }, (error, slug) => {
        if (error) {
          // Show error message
          sAlert.error(error, { timeout: 'none' });
          // Redirect to API catalog
          FlowRouter.go('apiCatalog');
        } else {
          // Redirect to newly added API
          FlowRouter.go('viewApi', { slug });
        }
      });

      // Get current user ID
      const userId = Meteor.userId();

      // Give user manager role
      Roles.addUsersToRoles(userId, 'manager');
    },
  },
});
