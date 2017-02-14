import { Template } from 'meteor/templating';
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';
import Posts from '/oembed_content/collection';
import 'moment/min/locales.min';


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
  'click .delete': function () {
    if (confirm('Do you really want delete this post?')) {
      const instance = Template.instance();
      const postId = instance.data.post._id;
      Posts.remove(postId);
    }
  },
  'click .edit': function (event, templateInstance) {
    const post = templateInstance.data.post;
    Modal.show('postsForm', {
      postItem: post,
      pageHeader: 'Edit post item',
    });
  },
});
