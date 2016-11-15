import { Meteor } from 'meteor/meteor';
// Collection imports
import { FeedbackVotes } from '/feedback_votes/collection';
import { Feedback } from '../';


Meteor.publish('apiBackendFeedback', (apiBackendId) => {
  // show feedback to specific API
  return Feedback.find({ apiBackendId });
});

Meteor.publish('getAllVotesForSingleFeedback', (feedbackId) => {
  // show feedbackvotes for single feedback
  return FeedbackVotes.find({ feedbackId });
});
