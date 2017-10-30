/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

// Meteor contributed packages imports
import { TAPi18n } from 'meteor/tap:i18n';

// Npm packages imports
import moment from 'moment';

Template.feedbackCommentItem.onCreated(function () {
  const instance = this;

  instance.formType = new ReactiveVar('insert');
});

Template.feedbackCommentItem.helpers({
  relativeTimeStamp (givenTimeStamp) {
    // Get current language
    const language = TAPi18n.getLanguage();

    return moment(givenTimeStamp).locale(language).fromNow();
  },
  formType () {
    const instance = Template.instance();

    return instance.formType.get();
  },
});

Template.feedbackCommentItem.events({
  'click .comment-reply': (event, templateInstance) => {
    // Get ID of current comment or feedback
    const itemId = templateInstance.data.item._id;
    // Get comment form
    const commentForm = document.getElementById(`feedback-reply-${itemId}`);

    // Show comment form
    commentForm.classList.remove('hide');

    // Create a new entityComment
    // formType is insert
    templateInstance.formType.set('insert');
  },
  'click .comment-delete': (event, templateInstance) => {
    // Get ID of current comment
    const commentId = templateInstance.data.item._id;
    // Get comment form
    const commentForm = document.getElementById(`feedback-reply-${commentId}`);

    // Hide comment form if it is displayed
    commentForm.classList.add('hide');

    // Delete this comment and replies of this comment
    Meteor.call('deleteComment', commentId);
  },
});
