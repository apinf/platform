import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.organizationCatalogueToolbar.onRendered(function () {
  // Get reference to template instance
  const instance = this;

  // Separate autoruns to runs own function for each parameter

  // Runs a function that depends only on SortBy parameter
  instance.autorun(() => {
    // Check URL parameter for sorting
    const sortByParameter = FlowRouter.getQueryParam('sortBy');

    // Set the sorting by UI state from URL parameter
    instance.$('#organization-sort-select').val(`${sortByParameter}`).change();
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

Template.organizationCatalogueToolbar.events({
  'change #organization-sort-select': function (event) {
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
  'change [name=view-mode]': function (event) {
    // Set URL parameter
    FlowRouter.setQueryParams({ viewMode: event.target.value });
  },
});
