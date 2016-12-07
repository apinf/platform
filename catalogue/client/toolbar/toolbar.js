Template.catalogueToolbar.onRendered(function () {
  // Get reference to template instance
  const instance = this;

  // Check URL parameter for filtering
  const filterByParameter = FlowRouter.getQueryParam('filterBy');

  // Check URL parameter for sorting
  const sortByParameter = FlowRouter.getQueryParam('sortBy');

  if (filterByParameter) {
    // Set the filter by UI state from URL parameter
    instance.$(`#filterBy-${filterByParameter}`).button('toggle');
  } else {
    // Get filtering from template
    const filterBy = instance.$('[name=filter-options]:checked').val();

    // Set filtering URL parameter from template value
    FlowRouter.setQueryParams({ filterBy });
  }

  if (sortByParameter) {
    // Set the sorting by UI state from URL parameter
    instance.$('#sort-select').val(`${sortByParameter}`).change();
  } else {
    // Get sorting from template
    const sortBy = instance.$('[name=sort-menu]').val();

    // Set sorting URL parameter from template value
    FlowRouter.setQueryParams({ sortBy });
  }
});
