// Meteor packages imports
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Roles } from 'meteor/alanning:roles';

// Collection imports
import Apis from '/apis/collection';
import ApiBookmarks from '/bookmarks/collection';

Template.apiCatalog.onCreated(function () {
  // Get reference to template instance
  const instance = this;

  // Get user id
  const userId = Meteor.userId();

  // Set filters
  // On default: Show all public apis for anonymous users
  let filters = { isPublic: true };

  if (userId) {
    // Show all available apis for registered users
    filters = {
      $or: [
        { isPublic: true },
        { managerIds: userId },
        { authorizedUserIds: userId },
      ],
    };
  }

  if (Roles.userIsInRole(userId, ['admin'])) {
    // Show all apis for administrators
    filters = {};
  }

  // Set initial settings of pagination
  instance.pagination = new Meteor.Pagination(Apis, {
    // Count of cards in catalog
    perPage: 24,
    // Set sort by name on default
    sort: { name: 1 },
    filters,
  });

  // Subscribe to API logo collection
  instance.subscribe('allApiLogo');

  // Subscribe to all users, returns only usernames
  instance.subscribe('allUsersUsernamesOnly');

  // Subscribe to bookmarks of current user
  instance.subscribe('userApiBookmarks');

  // Watch for changes in the sort and filter settings
  instance.autorun(() => {
    // Check URL parameter for sorting
    const sortByParameter = FlowRouter.getQueryParam('sortBy');

    // Check URL parameter for sort direction and convert to integer
    const sortDirectionParameter =
      FlowRouter.getQueryParam('sortDirection') === 'ascending' ? 1 : -1;

    // Check URL parameter for filtering
    const filterByParameter = FlowRouter.getQueryParam('filterBy');

    // Check URL parameter for filtering by lifecycle status
    const lifecycleStatusParameter = FlowRouter.getQueryParam('lifecycle');

    // Create a object for storage sorting parameters
    const sort = {};
    // GCheck of existing parameters
    if (sortByParameter && sortDirectionParameter) {
      // Get field and direction of sorting
      sort[sortByParameter] = sortDirectionParameter;
    } else {
      // Otherwise get it like default value
      sort.name = 1;
    }

    // Change sorting
    instance.pagination.sort(sort);

    let currentFilters = filters;

    // Filtering available for registered users
    if (userId) {
      switch (filterByParameter) {
        case 'all': {
          // Delete filter for managed apis & bookmarks
          delete currentFilters.managerIds;
          delete currentFilters._id;
          break;
        }
        case 'my-apis': {
          // Delete filter for bookmarks
          delete currentFilters._id;
          // Set filter for managed apis
          currentFilters.managerIds = userId;
          break;
        }
        case 'my-bookmarks': {
          // Delete filter for managed apis
          delete currentFilters.managerIds;
          // Get user bookmarks
          const userBookmarks = ApiBookmarks.findOne() || '';
          // Set filter for bookmarks
          currentFilters._id = { $in: userBookmarks.apiIds };
          break;
        }
        default: {
          // Otherwise get it like default value
          currentFilters = { isPublic: true };
          break;
        }
      }
    } else {
      // Otherwise get it like default value
      currentFilters = { isPublic: true };
    }

    // Checking of filter bu lifecycle status was set
    if (lifecycleStatusParameter) {
      // Set filter
      currentFilters.lifecycleStatus = lifecycleStatusParameter;
    } else {
      // Can be case when filter was set and user clicks on Clear button.
      // Query parameter doesn't exists but database query has field.

      // Delete field from object.
      delete currentFilters.lifecycleStatus;
    }

    instance.pagination.filters(currentFilters);
  });
});

// eslint-disable-next-line prefer-arrow-callback
Template.apiCatalog.onRendered(function () {
  // Activate tooltips on all relevant items
  $('.toolbar-tooltip').tooltip({ placement: 'bottom' });
});

Template.apiCatalog.helpers({
  apis () {
    // Return items of apis collection via Pagination
    return Template.instance().pagination.getPage();
  },
  templatePagination () {
    // Get reference of pagination
    return Template.instance().pagination;
  },
  gridViewMode () {
    // Get view mode from template
    const viewMode = FlowRouter.getQueryParam('viewMode');

    return (viewMode === 'grid');
  },
  tableViewMode () {
    // Get view mode from template
    const viewMode = FlowRouter.getQueryParam('viewMode');

    return (viewMode === 'table');
  },
});
