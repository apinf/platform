// Meteor packages imports
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { FlowRouter } from 'meteor/kadira:flow-router';

FlowRouter.route('/apis', {
  // Get query parameters for Catalog page on Enter
  triggersEnter: [function (context) {
    if (!context.queryParams.sortBy) {
      context.queryParams.sortBy = 'name';
    }
    if (!context.queryParams.sortDirection) {
      context.queryParams.sortDirection = 'ascending';
    }
    if (!context.queryParams.viewMode) {
      context.queryParams.viewMode = 'grid';
    }
    if (!context.queryParams.filterBy && Meteor.userId()) {
      context.queryParams.filterBy = 'all';
    }
  }],
  name: 'apiCatalog',
  action: () => {
    BlazeLayout.render('masterLayout', { main: 'apiCatalog' });
  },
});
