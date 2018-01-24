/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { FlowRouter } from 'meteor/kadira:flow-router';

// Collection imports
import Organizations from '/apinf_packages/organizations/collection';

import '/apinf_packages/organizations/client/catalog/toolbar/toolbar.html';

Template.organizationCatalogToolbar.onRendered(function () {
  // Get reference to template instance
  const instance = this;

  // Separate autoruns to run own function for each parameter

  // Runs a function that depends only on SortBy parameter
  instance.autorun(() => {
    // Check URL parameter for sorting
    const sortByParameter = FlowRouter.getQueryParam('sortBy');

    // Set the sorting by UI state from URL parameter
    instance.$('#organization-sort-select').val(`${sortByParameter}`);
  });

  // Runs a function that depends only on sortDirection parameter
  instance.autorun(() => {
    // Check URL parameter for sort direction
    const sortDirectionParameter = FlowRouter.getQueryParam('sortDirection');

    // Set the sorting direction by UI state from URL parameter
    instance.$(`#organization-sort-${sortDirectionParameter}`).button('toggle');
  });

  // Runs a function that depends only on filterBy parameter
  instance.autorun(() => {
    // Check URL parameter for filtering
    const filterByParameter = FlowRouter.getQueryParam('filterBy');

    // Set the filter by UI state from URL parameter
    instance.$(`#filter-${filterByParameter}`).button('toggle');
  });

  // Runs a function that depends only on viewMode parameter
  instance.autorun(() => {
    // Check URL parameter for view mode
    const viewModeParameter = FlowRouter.getQueryParam('viewMode');

    // Set the view mode direction by UI state from URL parameter
    instance.$(`[for=${viewModeParameter}-view]`).button('toggle');
  });
});

Template.organizationCatalogToolbar.helpers({
  userIsOrganizationManager () {
    // Get ID of current user
    const userId = Meteor.userId();
    // Get all managed organizations
    const organizations = Organizations.find({ managerIds: userId }).fetch();
    // Show filter if user has at least one managed organization
    return organizations.length > 0;
  },
});

Template.organizationCatalogToolbar.events({
  'change .filter-sort-control': (event) => {
    // Initialize placeholder for query parameters
    const queryParameters = {};

    // Get "name" attribute of selected element
    const parameterName = event.target.name;

    // Create the query parameters object, using the key and value
    queryParameters[parameterName] = event.target.value;

    // Set URL parameter
    FlowRouter.setQueryParams(queryParameters);
  },
});
