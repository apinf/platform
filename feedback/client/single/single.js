import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';

import { FeedbackVotes } from '/feedback_votes/collection';
import { Apis } from '/apis/collection';

Template.singleFeedback.onCreated(function () {
  // Get ID of current feedback object
  const feedbackId = this.data._id;

  // Get the API Backend ID from the route
  this.apiId = Router.current().params._id;

  // Subscribe to a single API Backend, by ID
  this.subscribe('apiBackend', this.apiId);

  // Subscribe to votes for this feedback
  this.subscribe('getAllVotesForSingleFeedback', feedbackId);
});

Template.singleFeedback.helpers({
  userUpvote () {
    // Get current Feedback ID
    const feedbackId = this._id;

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
    const feedbackId = this._id;

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
  api () {
    // Get reference to template instance
    const instance = Template.instance();

    // Get API ID
    const apiId = instance.apiId;

    // Get single API Backend
    const api = Apis.findOne(apiId);

    return api;
  },
});

Template.singleFeedback.events({
  'click .up-vote': () => {
    // Get reference to current feedback
    const feedback = this;

    // Get ID of current feedback object
    const feedbackId = feedback._id;

    // Submit upvote (+1) for current feedback
    Meteor.call('submitVote', feedbackId, 1);
  },
  'click .down-vote': () => {
    // Get reference to current feedback
    const feedback = this;

    // Get ID of current feedback object
    const feedbackId = feedback._id;

    // Submit downvote (-1) for current feedback
    Meteor.call('submitVote', feedbackId, -1);
  },
});
