/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { AutoForm } from 'meteor/aldeed:autoform';
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';

// Collection imports
import feedbackData from '../../item/item.js';

AutoForm.hooks({
  commentForm: {
    before: {
      insert (comment) {
        const feedback = feedbackData.get();
        comment.postId = feedback.postId;
        comment.type = feedback.type;
        comment.commentedOn = feedback.commentedOn ? feedback.commentedOn : '';
        return comment;
      },
    },
    onSuccess () {
      // Get success message translation
      const message = TAPi18n.__('entityCommentm_successMessage');
      // Get postId either from comment or feedback
      const postId = feedbackData.get().commentedOn ?
        feedbackData.get().commentedOn
      :
        feedbackData.get().postId;
      // Hide comment input after submit successfully
      $(`#feedback-reply-${postId}`).css('display', 'none');
      // Alert user of success
      sAlert.success(message);
    },
  },
});
