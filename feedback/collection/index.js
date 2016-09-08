import ss from 'simple-statistics';

export const Feedback = new Mongo.Collection('feedback');

Feedback.allow({
  insert () {
    return true;
  },
});

Feedback.helpers({
  'sumOfVotes': function () {
    // Get all votes for current feedback
    const feedbacks = FeedbackVotes.find({ feedbackId: this._id }).fetch();

    // Create a list of all feedback vote values
    const votes = _(feedbacks).map(function (feedback) {
      return feedback.vote;
    });

    // Calculate the sum of all vote values
    const sum = ss.sum(votes);
    return sum;
  },
});
