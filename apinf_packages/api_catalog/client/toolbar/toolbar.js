/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Roles } from 'meteor/alanning:roles';

// Collection imports
import Settings from '/apinf_packages/settings/collection';

Template.apiCatalogToolbar.onRendered(function () {
  // Get reference to template instance
  const instance = this;

  // Check URL parameter for sorting
  const sortByParameter = FlowRouter.getQueryParam('sortBy');

  // Check URL parameter for sort direction
  const sortDirectionParameter = FlowRouter.getQueryParam('sortDirection');

  // Check URL parameter for filtering
  const filterByParameter = FlowRouter.getQueryParam('filterBy');

  // Check URL parameter for view mode
  const viewModeParameter = FlowRouter.getQueryParam('viewMode');

  // Set the sorting by UI state from URL parameter
  instance.$('#sort-select').val(`${sortByParameter}`);
  // Set the sorting direction by UI state from URL parameter
  instance.$(`#sortDirection-${sortDirectionParameter}`).button('toggle');
  // Set the filter by UI state from URL parameter
  instance.$(`#filterBy-${filterByParameter}`).button('toggle');
  // Set the view mode direction by UI state from URL parameter
  instance.$(`#viewMode-${viewModeParameter}`).button('toggle');
});

Template.apiCatalogToolbar.events({
  'change #sort-select': function (event) {
    // Set URL parameter
    FlowRouter.setQueryParams({ sortBy: event.target.value });
  },
  'change [name=sort-direction]': function (event) {
    // Set URL parameter
    FlowRouter.setQueryParams({ sortDirection: event.target.value });
  },
  'change [name=filter-options]': function (event) {
    // Set URL parameter
    FlowRouter.setQueryParams({ filterBy: event.target.value });
  },
  'change [name=filter-api-documentation]': function (event) {
    // Set URL parameter
    FlowRouter.setQueryParams({ apisWithDocumentation: event.currentTarget.checked });
  },
  'change [name=view-mode]': function (event) {
    // Set URL parameter
    FlowRouter.setQueryParams({ viewMode: event.target.value });
  },
});
