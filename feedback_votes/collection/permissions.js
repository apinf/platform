import { FeedbackVotes } from './';

FeedbackVotes.allow({
  insert: function () {
    // Only allow logged in user to vote
    if (Meteor.userId) {
      return true;
    }
  },
  update: function () {
    // TODO: only allow user to update own vote
    if (Meteor.userId) {
      return true;
    }
  },
  remove: function () {
    // TODO: only allow user to remove own vote
    if (Meteor.userId) {
      return true;
    }
  }
});
