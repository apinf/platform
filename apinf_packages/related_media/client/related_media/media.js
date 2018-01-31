/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

// Meteor contributed packages imports
import { TAPi18n } from 'meteor/tap:i18n';
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';

// Collection imports
import Posts from '/apinf_packages/related_media/collection';

import '/apinf_packages/related_media/client/related_media/media.html';

Template.relatedMedia.onCreated(function () {
  const instance = this;
  // Set initial settings of pagination
  instance.pagination = new Meteor.Pagination(Posts, {
    // Count of posts on page
    perPage: parseInt(instance.data.entity.mediasNumberPerPage, 10),
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

  // reactive solution to update pagination with template instant data
  instance.autorun(() => {
    if (Template.currentData().entity) {
      const perPage = Template.currentData().entity.mediaPerPage || 10;

      instance.pagination.perPage(perPage);
    }
  });
});

Template.relatedMedia.helpers({
  posts () {
    const instance = Template.instance();

    // Return items of organization collection via Pagination
    return instance.pagination.getPage();
  },
  templatePagination () {
    // Get reference of pagination
    return Template.instance().pagination;
  },
  noRelatedMedia () {
    // Get entity
    const entity = Template.instance().data.entity;
    // Get entity Type
    const entityType = entity.entityType();
    // Text of message depends on entity type
    return TAPi18n.__(`relatedMedia_text_noRelatedMedia.${entityType}`);
  },
});

Template.relatedMedia.events({
  'click #add-media': function (event, templateInstance) {
    const entity = templateInstance.data.entity;
    Modal.show('relatedMediaPostsForm', { entity });
  },
});
