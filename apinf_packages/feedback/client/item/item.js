/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';

// Npm packages imports
import moment from 'moment';

// Collection imports
import FeedbackVotes from '/apinf_packages/feedback_votes/collection';

const feedbackData = new ReactiveVar(false);

Template.feedbackItem.onCreated(function () {
  // Get ID of current feedback object
  const feedbackId = Template.currentData().item._id;

  // Subscribe to votes for this feedback
  this.subscribe('getAllVotesForSingleFeedback', feedbackId);
  // this.subscribe('getCommentForSingleFeedback', feedbackId);
});

Template.feedbackItem.helpers({
  checkIsPrivate () {
    // Check it is private
    if (!Template.currentData().item.isPublic) {
      // If private, then show background yellow by class
      return 'private-feedback-background';
    }
    return '';
  },
  feedbackType () {
    // Return translation for feedback message type

    // Get item
    const item = Template.instance().data.item;
    // Return translation for type
    return TAPi18n.__(`feedbackItem_messageType.${item.messageType}`);
  },
  userUpvote () {
    // Get current Feedback ID
    const feedbackId = Template.currentData().item._id;

    // Get current User ID
    const userId = Meteor.userId();

    // Build a query for to get current user's feedback
    const query = { feedbackId, userId };

    // Get user vote using query
    const userVote = FeedbackVotes.findOne(query);

    let voteClass = '';
    // If user vote is plus one, it is an upvote
    if (userVote && userVote.vote === 1) {
      voteClass = 'user-vote';
    }
    return voteClass;
  },
  userDownvote () {
    // Get current Feedback ID
    const feedbackId = Template.currentData().item._id;

    // Get current User ID
    const userId = Meteor.userId();

    // Build a query for to get current user's feedback
    const query = { feedbackId, userId };

    // Get user vote using query
    const userVote = FeedbackVotes.findOne(query);

    let voteClass = '';
    // If user vote is minus one, it is a downvote
    if (userVote && userVote.vote === -1) {
      voteClass = 'user-vote';
    }
    return voteClass;
  },
  relativeTimeStamp (givenTimeStamp) {
    // Get current language
    const language = TAPi18n.getLanguage();

    return moment(givenTimeStamp).locale(language).fromNow();
  },
});

Template.feedbackItem.events({
  'click .up-vote': function () {
    // Get ID of current feedback object
    const feedbackId = Template.currentData().item._id;

    // Submit upvote (+1) for current feedback
    Meteor.call('submitVote', feedbackId, 1, (error) => {
      // Catch error on anonymous voting
      if (error && error.error === 'apinf-usernotloggedin-error') {
        // Get error message
        const message = TAPi18n.__('feedbackItem_usernotloggedin_errorMessage');
        // Notifies user to login to vote
        sAlert.error(message);
      }
    });
  },
  'click .down-vote': function () {
    // Get ID of current feedback object
    const feedbackId = Template.currentData().item._id;

    // Submit downvote (-1) for current feedback
    Meteor.call('submitVote', feedbackId, -1, (error) => {
      // Catch error on anonymous voting
      if (error && error.error === 'apinf-usernotloggedin-error') {
        // Get error message
        const message = TAPi18n.__('feedbackItem_usernotloggedin_errorMessage');
        // Notifies user to login to vote
        sAlert.error(message);
      }
    });
  },
  'click .edit-feedback-item': function () {
    // Get feedback item
    const item = Template.currentData().item;
    // Show edit feedback form modal
    Modal.show('feedbackForm', { formType: 'update', feedbackItem: item });
  },
  'click .delete-feedback-item': function () {
    // Get feedback item
    const item = Template.currentData().item;
    // Show the Delete Confirmation dialogue
    Modal.show('deleteFeedbackItem', { feedbackItem: item });
  },
  'click .visibility-feedback-item': () => {
    // Get feedback item
    const item = Template.currentData().item;

    // Set the new visibility of feedback
    Meteor.call('changeFeedbackVisibility', item._id, !item.isPublic);
  },
  'click .feedback-reply': () => {
    $('.feedback-reply-form').css('display', 'none');
    const commentData = {
      postId: Template.currentData().item._id,
      type: 'Feedback',
    };
    feedbackData.set(commentData);
    $(`#feedback-reply-${Template.currentData().item._id}`)
      .css('display', 'block');
  },
});
export default feedbackData;
