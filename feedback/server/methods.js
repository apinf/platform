/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// Meteor contributed packages imports
import { TAPi18n } from 'meteor/tap:i18n';

// Collection imports
import FeedbackVotes from '/feedback_votes/collection';
import Feedback from '../collection';

Meteor.methods({
  deleteFeedback (feedbackItemId) {
    // Make sure feedbackItemId is a String
    check(feedbackItemId, String);

    // 1. Remove feedback votes
    FeedbackVotes.remove({ feedbackId: feedbackItemId });

    // 2. Remove feedback item
    Feedback.remove(feedbackItemId);
  },
  submitVote (feedbackId, vote) {
    // Make sure feedbackId is a String
    check(feedbackId, String);

    // Make sure vote is a Number
    check(vote, Number);

    // Get current user ID
    const userId = Meteor.userId();

    // Check user is loggedin
    if (userId) {
      // Get feedback vote for current User / Feedback ID
      const userVote = FeedbackVotes.findOne({ feedbackId, userId });

      // If user has voted
      if (userVote) {
        // Get existing vote value
        const existingVote = userVote.vote;

        // If the existing vote is the same as submitted vote, cancel/remove the vote.
        if (vote === existingVote) {
          FeedbackVotes.remove(userVote._id);
        // Otherwise update users vote.
        } else {
          // Update existing vote, replacing the existing value with new value
          FeedbackVotes.update({
            feedbackId,
            userId,
          }, {
            $set: { vote },
          });
        }
      } else {
        // User has not voted -> add new user vote
        FeedbackVotes.insert({ feedbackId, userId, vote });
      }
    } else {
      // Throw usernotloggedin error for client
      throw new Meteor.Error(
        'apinf-usernotloggedin-error',
        TAPi18n.__('apinf_usernotloggedin_error')
      );
    }
  },
});
