import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.catalogueToolbar.onRendered(function () {
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

  if (sortByParameter) {
    // Set the sorting by UI state from URL parameter
    instance.$('#sort-select').val(`${sortByParameter}`).change();
  } else {
    // Get sorting from template
    const sortBy = instance.$('[name=sort-menu]').val();

    // Set sorting URL parameter from template value
    FlowRouter.setQueryParams({ sortBy });
  }

  if (sortDirectionParameter) {
    // Set the sorting direction by UI state from URL parameter
    instance.$(`#sortDirection-${sortDirectionParameter}`).button('toggle');
  } else {
    // Get sorting direction from template
    const sortDirection = instance.$('[name=sort-direction]:checked').val();

    // Set sorting direction URL parameter from template value
    FlowRouter.setQueryParams({ sortDirection });
  }

  if (filterByParameter) {
    // Set the filter by UI state from URL parameter
    instance.$(`#filterBy-${filterByParameter}`).button('toggle');
  } else {
    // Get filtering from template
    const filterBy = instance.$('[name=filter-options]:checked').val();

    // Set filtering URL parameter from template value
    FlowRouter.setQueryParams({ filterBy });
  }

  if (viewModeParameter) {
    // Set the view mode direction by UI state from URL parameter
    instance.$(`#viewMode-${viewModeParameter}`).button('toggle');
  } else {
    // Get view mode direction from template
    const viewMode = instance.$('[name=view-mode]:checked').val();

    // Set view mode direction URL parameter from template value
    FlowRouter.setQueryParams({ viewMode });
  }
});

Template.catalogue.helpers({
  gridViewMode () {
  // Get reference to template instance
    const instance = Template.instance();

  // Get view mode from template
    const viewMode = instance.viewMode.get();

    return (viewMode === 'grid');
  },
  tableViewMode () {
  // Get reference to template instance
    const instance = Template.instance();

  // Get view mode from template
    const viewMode = instance.viewMode.get();

    return (viewMode === 'table');
  },
});
Template.catalogue.events({
  // Catalogue
  'change #sort-select': function (event, templateInstance) {
    // Get selected sort value
    const sortBy = event.target.value;

    // Update the instance sort value reactive variable
    templateInstance.sortBy.set(sortBy);

    // Set URL parameter
    FlowRouter.setQueryParams({ sortBy: event.target.value });
  },
  'change [name=sort-direction]': function (event, templateInstance) {
    // Get selected sort value
    const sortDirection = event.target.value;

    // Update the instance sort value reactive variable
    templateInstance.sortDirection.set(sortDirection);

    // Set URL parameter
    FlowRouter.setQueryParams({ sortDirection: event.target.value });
  },
  'change [name=filter-options]': function (event, templateInstance) {
    // Get selected sort value
    const filterBy = event.target.value;

    // Update the instance sort value reactive variable
    templateInstance.filterBy.set(filterBy);

    // Set URL parameter
    FlowRouter.setQueryParams({ filterBy: event.target.value });
  },
  'change [name=view-mode]': function (event, templateInstance) {
    // Get selected sort value
    const viewMode = event.target.value;

    // Update the instance sort value reactive variable
    templateInstance.viewMode.set(viewMode);

    // Set URL parameter
    FlowRouter.setQueryParams({ viewMode: event.target.value });
  },
});
