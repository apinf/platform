/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Collection imports
import EntityComment from '/apinf_packages/entityComment/collection';
import feedbackData from '../../item/item.js';

Template.commentForm.helpers({
  entityCommentCollection () {
    // Return a reference to Entity comment collection, for AutoForm
    return EntityComment;
  },
});


Template.commentForm.events({
  'click .cancel-comment-reply': () => {
    // Get postId either from comment or feedback
    const postId = feedbackData.get().commentedOn ?
      feedbackData.get().commentedOn
    :
      feedbackData.get().postId;
    feedbackData.set(false);
    $(`#feedback-reply-${postId}`).css('display', 'none');
  },
});
