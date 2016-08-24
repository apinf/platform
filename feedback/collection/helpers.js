import { Feedback } from './';
import { FeedbackVotes } from '/feedback_votes/collection';

Feedback.helpers({
  'sumOfVotes': function () {
    // Get all votes for current feedback
    var feedbacks = FeedbackVotes.find({feedbackId: this._id}).fetch();

    // Create a list of all feedback vote values
    var votes = _(feedbacks).map(function(feedback){
      return feedback.vote;
    });

    // Make sure votes are available to sum
    if (votes && votes.length > 0) {
      // Sum the array of votes
      let sumOfVotes = votes.reduce(function (a, b) {
        return a + b;
      });

      return sumOfVotes;
    }
  }
});
