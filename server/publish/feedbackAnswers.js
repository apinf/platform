Meteor.publish('feedbackAnswers', function () {
  return FeedbackAnswers.find();
});
