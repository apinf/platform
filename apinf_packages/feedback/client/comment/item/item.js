/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { TAPi18n } from 'meteor/tap:i18n';

// Npm packages imports
import moment from 'moment';

// Collection imports
import feedbackData from '../../item/item.js';

Template.feedbackCommentItem.helpers({
  relativeTimeStamp (givenTimeStamp) {
    // Get current language
    const language = TAPi18n.getLanguage();

    return moment(givenTimeStamp).locale(language).fromNow();
  },
});

Template.feedbackCommentItem.events({
  'click .comment-reply': () => {
    // hide all other comment field
    $('.feedback-reply-form').css('display', 'none');

    // get all comment related data
    const commentData = {
      postId: Template.currentData().item.postId,
      type: Template.currentData().item.type,
      commentedOn: Template.currentData().item._id,
    };

		// Set all comment related data into reactive var
    feedbackData.set(commentData);

    // show comment input
    $(`#feedback-reply-${Template.currentData().item._id}`)
      .css('display', 'block');
  },
});
