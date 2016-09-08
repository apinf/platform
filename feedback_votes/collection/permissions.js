import { FeedbackVotes } from './';

FeedbackVotes.allow({
  insert () {
    // Only allow logged in user to vote
    if (Meteor.userId) {
      return true;
    }
  },
  update () {
    // TODO: only allow user to update own vote
    if (Meteor.userId) {
      return true;
    }
  },
  remove () {
    // TODO: only allow user to remove own vote
    if (Meteor.userId) {
      return true;
    }
  },
});
