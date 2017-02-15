// Collection imports
import FeedbackVotes from '/feedback_votes/collection';
import Feedback from '../';

Meteor.publish('apiBackendFeedback', (apiBackendId) => {
  // Make sure apiBackendId is a String
  check(apiBackendId, String);

  // show feedback to specific API
  return Feedback.find({ apiBackendId });
});

Meteor.publish('getAllVotesForSingleFeedback', (feedbackId) => {
  // Make sure apiBackendId is a String
  check(feedbackId, String);

  // show feedbackvotes for single feedback
  return FeedbackVotes.find({ feedbackId });
});
