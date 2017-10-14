/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// Collection imports
import EntityComment from '/apinf_packages/entityComment/collection';
import FeedbackVotes from '/apinf_packages/feedback_votes/collection';

Meteor.publish('getAllVotesForSingleFeedback', (feedbackId) => {
  // Make sure apiBackendId is a String
  check(feedbackId, String);

  // show feedbackvotes for single feedback
  return FeedbackVotes.find({ feedbackId });
});

Meteor.publish('getCommentForSingleFeedback', (postId) => {
  // Make sure feedbackId is a String
  check(postId, String);
  // show comment for single feedback
  return EntityComment.find({ postId });
});

Meteor.publish('getUsernameForSingleComment', (userId) => {
  // Make sure userId is a String
  check(userId, String);
  // show author's username for single comment/feedback
  return Meteor.users.find(userId);
});
