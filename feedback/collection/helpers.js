import { Feedback } from './';
import { FeedbackVotes } from '/feedback_votes/collection';

import ss from 'simple-statistics';

Feedback.helpers({
  sumOfVotes () {
    // Get all votes for current feedback
    const allFeedback = FeedbackVotes.find({ feedbackId: this._id }).fetch();

    // Create a list of all feedback vote values
    const votes = _(allFeedback).map(function (feedback) {
      return feedback.vote;
    });

    // Calculate the sum of all vote values
    const sum = ss.sum(votes);
    return sum;
  },
});
