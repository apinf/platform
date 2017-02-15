// Meteor packages imports
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { FlowRouter } from 'meteor/kadira:flow-router';

FlowRouter.route('/organizations', {
  // Get query parameters for Catalog page on Enter
  triggersEnter: [function (context) {
    if (!context.queryParams.sortBy) {
      // Set query parameter if it doesn't exist
      context.queryParams.sortBy = 'name';
    }
    if (!context.queryParams.sortDirection) {
      // Set query parameter if it doesn't exist
      context.queryParams.sortDirection = 'ascending';
    }
    if (!context.queryParams.viewMode) {
      // Set query parameter if it doesn't exist
      context.queryParams.viewMode = 'grid';
    }
    // filterBy parameter must be available only for registered users
    if (!context.queryParams.filterBy && Meteor.userId()) {
      // Set query parameter if it doesn't exist
      context.queryParams.filterBy = 'all';
    }
  }],
  name: 'organizationCatalog',
  action () {
    BlazeLayout.render('masterLayout', { main: 'organizationCatalog' });
  },
});

FlowRouter.route('/organizations/:slug', {
  name: 'organizationProfile',
  action () {
    BlazeLayout.render('masterLayout', { main: 'organizationProfile' });
  },
});
