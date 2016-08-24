Meteor.publish('getAllVotesForSingleFeedback', function(feedbackId){
  // Publish feedback votes for single feedback
  return FeedbackVotes.find({feedbackId: feedbackId});
});
