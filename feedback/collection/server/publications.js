// Collection imports
import { Feedback } from '../';
import { FeedbackVotes } from '/feedback_votes/collection';

Meteor.publish('apiBackendFeedback', function (apiBackendId) {
  // show feedback to specific API
  return Feedback.find({ apiBackendId });
});

Meteor.publish('getAllVotesForSingleFeedback', function (feedbackId) {
  // show feedbackvotes for single feedback
  return FeedbackVotes.find({ feedbackId });
});
