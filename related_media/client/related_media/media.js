/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';
import Posts from '/related_media/collection';

Template.relatedMedia.onCreated(function () {
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

  // Make sure entity is available
  if (instance.data.entity) {
    currentFilters.entityId = instance.data.entity._id;
    currentFilters.entityType = instance.data.entity.entityType;
  }

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
  wellMessage () {
    // Get entity
    const entity = Template.instance().data.entity;
    // Get entity Type
    const entityType = entity.entityType();
    // Text of message depends on entity type
    return TAPi18n.__(`relatedMedia_Well_Message.${entityType}`);
  },
});

Template.relatedMedia.events({
  'click #add-media': function () {
    const entity = this.entity;
    Modal.show('relatedMediaPostsForm', { entity });
  },
});
