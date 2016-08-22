import ss from 'simple-statistics';

const Feedback = new Mongo.Collection('feedback');

export { Feedback };

Feedback.allow({
  insert: function () {
    return true;
  }
});

Feedback.helpers({
  'sumOfVotes': function () {
    // Get all votes for current feedback
    var feedbacks = FeedbackVotes.find({feedbackId: this._id}).fetch();

    // Create a list of all feedback vote values
    var votes = _(feedbacks).map(function(feedback){
      return feedback.vote;
    });

    // Calculate the sum of all vote values
    var sum = ss.sum(votes);
    return sum;
  }
});
