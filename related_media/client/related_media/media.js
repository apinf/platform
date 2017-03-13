import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';
import Posts from '/related_media/collection';

Template.relatedMedia.onCreated(function () {
  const instance = this;

  // console.log('inst=', instance);
  // Set initial settings of pagination
  instance.pagination = new Meteor.Pagination(Posts, {
    // Count of posts on page
    perPage: 4,
    // Set sort by creation datestamp on default
    sort: { createdAt: -1 },
  });

  // Get posts owned by API
  const currentFilters = {};
  currentFilters.entityId = instance.data.entity._id;
  currentFilters.entityType = instance.data.entity.getRelatedMediaIndex;
  instance.pagination.filters(currentFilters);
});

Template.relatedMedia.helpers({
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

Template.relatedMedia.events({
  'click #add-media': function () {
    // TODO this.api needs to be replaced
    const entity = this.entity;
    Modal.show('relatedMediaPostsForm', { entity });
  },
});
