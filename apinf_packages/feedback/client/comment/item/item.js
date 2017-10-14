/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { TAPi18n } from 'meteor/tap:i18n';

// Npm packages imports
import moment from 'moment';

Template.feedbackCommentItem.onCreated(function () {
  // Get author Id of currnet comment object
  const authorId = Template.currentData().item.authorId;
  // Fetch author's username of this comment
  this.subscribe('getUsernameForSingleComment', authorId);
  this.formType = 'insert';
});

Template.feedbackCommentItem.helpers({
  relativeTimeStamp (givenTimeStamp) {
    // Get current language
    const language = TAPi18n.getLanguage();

    return moment(givenTimeStamp).locale(language).fromNow();
  },
  formType () {
    return Template.instance().formType;
  },
});

Template.feedbackCommentItem.events({
  'click .comment-reply': () => {
    // hide all other comment field
    $('.feedback-reply-form').css('display', 'none');
    // show comment input
    $(`#feedback-reply-${Template.currentData().item._id}`)
      .css('display', 'block');
  },
  'click .comment-edit': () => {
    $('.feedback-reply-form').css('display', 'none');
    $(`#feedback-reply-${Template.currentData().item._id}`)
      .css('display', 'block');
  },
  'click .comment-delete': () => {
    const commentId = Template.currentData().item._id;
    Meteor.call('deleteComment', commentId);
  },
});
