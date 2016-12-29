import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Roles } from 'meteor/alanning:roles';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Apis } from '/apis/collection';
import { ApiBookmarks } from '/bookmarks/collection';

import { $ } from 'jquery';

Template.catalogue.onCreated(function () {
  // Get reference to template instance
  const instance = this;

  // Subscribe to all API logos
  instance.subscribe('allApiLogo');

  // Subscribe to all users, returns only usernames
  instance.subscribe('allUsers');

    // Set filters
  // On default: Show all public apis for anonymous users
  let filters = { isPublic: true };

  // Get user id
  const userId = Meteor.userId();

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

  // Watch for changes in the sort and filter settings
  instance.autorun(() => {
    // Check URL parameter for sorting
    const sortBy = FlowRouter.getQueryParam('sortBy');

    // Check URL parameter for sort direction and convert to integer
    const sortDirection = FlowRouter.getQueryParam('sortDirection') === 'ascending' ? 1 : -1;

    // Create a object for storage sorting parameters
    const sort = {};

    // GCheck of existing parameters
    if (sortBy && sortDirection) {
      // Get field and direction of sorting
      sort[sortBy] = sortDirection;
    } else {
      // Otherwise get it like default value
      sort.name = 1;
    }

    // Change sorting
    instance.pagination.sort(sort);

    let currentFilters = filters;

    // Check URL parameter for filtering
    const filterBy = FlowRouter.getQueryParam('filterBy');

    // Filtering available for registered users
    if (userId) {
      switch (filterBy) {
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
          const userBookmarks = ApiBookmarks.findOne({ userId }) || '';
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

    instance.pagination.filters(currentFilters);
  });
});

Template.catalogue.onRendered(function () {
  // Activate tooltips on all relevant items
  $('.toolbar-tooltip').tooltip({ placement: 'bottom' });
});

Template.catalogue.helpers({
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

Template.catalogue.events({
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
  'change [name=view-mode]': function (event) {
    // Set URL parameter
    FlowRouter.setQueryParams({ viewMode: event.target.value });
  },
});
