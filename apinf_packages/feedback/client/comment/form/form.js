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
  commentFormType () {
    return this.formType;
  },
  comment () {
    let commentData;
    if (this.type === 'commentReply') {
      commentData = {
        postId: this.item.postId,
        type: this.item.type,
        commentedOn: this.item._id,
      };
    } else {
      commentData = {
        postId: this.item._id,
        type: 'Feedback',
        commentedOn: '',
      };
    }
    return commentData;
  },
});


Template.commentForm.events({
  'click .cancel-comment-reply': () => {
    $('.feedback-reply-form').css('display', 'none');
  },
});
