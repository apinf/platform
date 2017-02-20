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

Template.postItem.helpers({
  // helpers here in future
});

Template.postItem.events({
  'click .delete': function (event, templateInstance) {
    // Get post from template instance
    const post = templateInstance.data.post;
    // Call modal confirmation dialogue and action
    Modal.show('deletePostConfirmation', { post });
  },
  'click .edit': function (event, templateInstance) {
    // Get post from template instance
    const post = templateInstance.data.post;
    // Call modal for editing, passing post and modal header as parameters
    Modal.show('postsForm', {
      postItem: post,
      pageHeader: 'Edit related media',
    });
  },
});
