import { ApiBackendRatings } from './';

ApiBackendRatings.allow({
  insert: function () {
    // User must be logged in to vote
    if (Meteor.userId()) {
      return true;
    }
  },
  update: function () {
    return true;
  }
});
