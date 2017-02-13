import { Posts } from '/oembed_content/collection';
import { TAPi18n } from 'meteor/tap:i18n';
import moment from 'moment';
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
  userIsPostOwner: function () {
    const instance = Template.instance();

    // Get Post ID from template instance
    const postOwnerId = instance.data.post.userId;
    const loggedUser = Meteor.userId();
    return postOwnerId === loggedUser;
  },
})

Template.postItem.events({
  'click .delete'() {
    if (confirm("Do you really want delete this post?")) {
      const instance = Template.instance();
      const postId = instance.data.post._id;
      Posts.remove(postId);
    }
  },
  'click .edit'(event, template) {
    const post = template.data.post;
    Modal.show("postsForm", {
      postItem: post,
      pageHeader: "Edit post item"
    });
  }
});
