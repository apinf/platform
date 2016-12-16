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

  // Set the sorting by UI state from URL parameter
  instance.$('#sort-select').val(`${sortByParameter}`).change();
  // Set the sorting direction by UI state from URL parameter
  instance.$(`#sortDirection-${sortDirectionParameter}`).button('toggle');
  // Set the filter by UI state from URL parameter
  instance.$(`#filterBy-${filterByParameter}`).button('toggle');
  // Set the view mode direction by UI state from URL parameter
  instance.$(`#viewMode-${viewModeParameter}`).button('toggle');
});
