/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Npm packages imports
import ss from 'simple-statistics';

// Collection imports
import Apis from '/apinf_packages/apis/collection';
import FeedbackVotes from '/apinf_packages/feedback_votes/collection';
import Feedback from './';

Feedback.helpers({
  currentUserCanSee () {
    // Get current userId
    const userId = Meteor.userId();

    // User without login can't see private feedbacks
    if (!userId && !this.isPublic) {
      return false;
    }

    // Check if user is owner of feedback
    const userIsOwner = this.authorId === userId;

    // Get API infos to check if user can manage the feedback's api
    const api = Apis.findOne({ _id: this.apiBackendId });

    return this.isPublic || userIsOwner || api.currentUserCanManage();
  },
  sumOfVotes () {
    // Get all votes for current feedback
    const allFeedback = FeedbackVotes.find({ feedbackId: this._id }).fetch();

    // Create a list of all feedback vote values
    const votes = allFeedback.map((feedback) => {
      return feedback.vote;
    });

    // Calculate the sum of all vote values
    const sum = ss.sum(votes);
    return sum;
  },
  author () {
    // Fetch only the author's username for current feedback
    const author = Meteor.users.findOne(this.authorId);

    return author.username;
  },
  currentUserCanEdit () {
    // Get current userId
    const userId = Meteor.userId();
    /* 1. Author is allowed to edit feedback */
    if (this.authorId === userId) {
      return true;
    }
    /* 2. Users that can edit API are allowed to edit feedback */
    // Get API by feedback's apiBackendId
    const api = Apis.findOne(this.apiBackendId);
    if (api && api.currentUserCanManage()) {
      return true;
    }
    // Otherwise not allowed to edit feedback
    return false;
  },
});
