/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

import { Template } from 'meteor/templating';
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';

Template.postItem.onRendered(function () {
  // Get reference to template instance
  const instance = this;

  // Get Post ID from template instance
  const postId = instance.data.post._id;
  // Get reference to post DOM element
  const postElement = instance.$(`#${postId}`);

  // Render OEmbed content
  postElement.oembed();
});
Template.postItem.events({
  'click .delete-post-item': function (event, templateInstance) {
    // Get post from template instance
    const post = templateInstance.data.post;
    // Call modal confirmation dialogue and action
    Modal.show('deletePostConfirmation', { post });
  },
  'click .edit-post-item': function (event, templateInstance) {
    // Get post from template instance
    const post = templateInstance.data.post;
    // Call modal for editing, passing post and modal header as parameters
    Modal.show('relatedMediaPostsForm', { post });
  },
});
