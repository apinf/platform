Meteor.publish('feedback', function () {
  return Feedback.find();
});
