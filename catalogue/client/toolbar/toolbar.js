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
