import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';

import { FeedbackVotes } from '/feedback_votes/collection';

import moment from 'moment';

Template.feedbackItem.onCreated(function () {
  // Get ID of current feedback object
  const feedbackId = Template.currentData().item._id;

  // Subscribe to votes for this feedback
  this.subscribe('getAllVotesForSingleFeedback', feedbackId);
});

Template.feedbackItem.helpers({
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
    return moment(givenTimeStamp).fromNow();
  },
});

Template.feedbackItem.events({
  'click .up-vote': function () {
    // Get ID of current feedback object
    const feedbackId = Template.currentData().item._id;

    // Submit upvote (+1) for current feedback
    Meteor.call('submitVote', feedbackId, 1);
  },
  'click .down-vote': function () {
    // Get ID of current feedback object
    const feedbackId = Template.currentData().item._id;

    // Submit downvote (-1) for current feedback
    Meteor.call('submitVote', feedbackId, -1);
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
});
