/* Copyright 2019 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Meteor contributed packages imports
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { FlowRouter } from 'meteor/kadira:flow-router';

FlowRouter.route('/tenants', {
  // Get query parameters for Catalog page on Enter
  triggersEnter: [function (context) {
    if (!context.queryParams.sortBy) {
      // Set query parameter if it doesn't exist
      context.queryParams.sortBy = 'bookmarkCount';
    }
    if (!context.queryParams.sortDirection) {
      // Set query parameter if it doesn't exist
      context.queryParams.sortDirection = 'ascending';
    }
    if (!context.queryParams.viewMode) {
      // Set query parameter if it doesn't exist
      context.queryParams.viewMode = 'table';
    }
    // filterBy parameter must be available only for registered users
    if (!context.queryParams.filterBy && Meteor.userId()) {
      // Set query parameter if it doesn't exist
      context.queryParams.filterBy = 'all';
    }
  }],
  name: 'tenantCatalog',
  action () {
    BlazeLayout.render('masterLayout', { bar: 'navbar', main: 'tenantCatalog' });
  },
});
