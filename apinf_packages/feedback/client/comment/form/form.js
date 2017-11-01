/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Collection imports
import EntityComment from '/apinf_packages/entityComment/collection';

Template.commentForm.helpers({
  entityCommentCollection () {
    // Return a reference to Entity comment collection, for AutoForm
    return EntityComment;
  },
  comment () {
    const comment = {};
    const item = Template.instance().data.item;

    const commentType = Template.instance().data.type;

    switch (commentType) {
      case 'feedback': {
        comment.postId = item._id;
        comment.type = commentType;
        break;
      }
      case 'comment': {
        comment.postId = item.postId;
        comment.type = commentType;
        comment.commentedOn = item._id;
        break;
      }
      default: {
        comment.postId = item._id;
        comment.type = commentType;
        break;
      }
    }

    return comment;
  },
});

Template.commentForm.events({
  'click .cancel-comment-reply': (event, templateInstance) => {
    // Get ID of current comment or feedback
    const itemId = templateInstance.data.item._id;
    // Get comment form
    const commentForm = document.getElementById(`feedback-reply-${itemId}`);

    // Hide comment form
    commentForm.classList.add('hide');

    // Reset any added text by user
    // It needs when a user's started to write text but clicks on Cancel button
    commentForm.children.commentForm.reset();
  },
  'click .submit-comment': (event, templateInstance) => {
    // Get ID of current comment or feedback
    const itemId = templateInstance.data.item._id;
    // Get comment form
    const commentForm = document.getElementById(`feedback-reply-${itemId}`);

    // Hide comment form
    commentForm.classList.add('hide');
  },
});
