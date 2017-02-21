import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';
import Posts from '/api_media/collection';

Template.apiRelatedMedia.onCreated(function () {
  const instance = this;
  // Set initial settings of pagination
  instance.pagination = new Meteor.Pagination(Posts, {
    // Count of posts on page
    perPage: 4,
    // Set sort by creation datestamp on default
    sort: { createdAt: -1 },
  });

  // Get posts owned by API
  const currentFilters = {};
  currentFilters.apiId = instance.data.api._id;
  instance.pagination.filters(currentFilters);
});

Template.apiRelatedMedia.helpers({
  posts () {
    const posts = Template.instance().pagination.getPage();

    // Return items of organization collection via Pagination
    return posts;
  },
  templatePagination () {
    // Get reference of pagination
    return Template.instance().pagination;
  },
});

Template.apiRelatedMedia.events({
  'click #add-oembed': function () {
    const api = this.api;
    Modal.show('apiMediaPostsForm', { pageHeader: 'Add related media', api });
  },
});
