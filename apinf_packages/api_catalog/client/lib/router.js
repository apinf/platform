/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Meteor contributed packages imports
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { FlowRouter } from 'meteor/kadira:flow-router';

FlowRouter.route('/apis', {
  // Get query parameters for Catalog page on Enter
  triggersEnter: [function (context) {
    if (!context.queryParams.sortBy) {
      context.queryParams.sortBy = 'name-asc';
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
    BlazeLayout.render('masterLayout', { bar: 'navbar', main: 'apiCatalog' });
  },
});

FlowRouter.route('/myapis', {
  // Get query parameters for Catalog page on Enter
  triggersEnter: [function (context) {
    if (!context.queryParams.sortBy) {
      context.queryParams.sortBy = 'name-asc';
    }
    if (!context.queryParams.viewMode) {
      context.queryParams.viewMode = 'grid';
    }
    if (!context.queryParams.filterBy && Meteor.userId()) {
      context.queryParams.filterBy = 'my-apis';
    }
  }],
  name: 'myApiCatalog',
  action: () => {
    BlazeLayout.render('masterLayout', { main: 'apiCatalog' });
  },
});
