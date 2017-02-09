import { Posts } from '/oembed_content/collection';
import { Meteor } from 'meteor/meteor';
Template.postsList.onCreated(function() {

  const instance = this;
  const userId = Meteor.userId();
  // Set initial settings of pagination
  instance.pagination = new Meteor.Pagination(Posts, {
    // Count of posts on page
    perPage: 4,
    // Set sort by creation datestamp on default
    sort: { createdAt: -1 },
  });
  // Watch for changes in the filter settings
  instance.autorun(() => {
    // Check URL parameter for filtering
    const filterByParameter = FlowRouter.getQueryParam('filterBy');
    // Set filter as empty
    let currentFilters = {};

    // Filtering available for registered users
    if (userId) {
      if (filterByParameter) {
        // set cursor pointer to posts' userID
      currentFilters.userId = userId;
      }
    }
    // Filter data
    instance.pagination.filters(currentFilters);
  });
});

Template.postsList.helpers({
  posts () {
    // Return items of organization collection via Pagination
    return Template.instance().pagination.getPage();
  },
  templatePagination () {
    // Get reference of pagination
    return Template.instance().pagination;
  },
});
