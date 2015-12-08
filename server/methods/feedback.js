Meteor.methods({
  'deleteFeedback': function(feedbackId) {
    // Removing feedback from collection
    Feedback.remove(feedbackId);
  },
  'submitVote': function(feedbackId, vote) {
    //check whether user has already voted
    var userId = Meteor.userId();
    var fvotesForId = FeedbackVotes.findOne({feedbackId: feedbackId, userId: userId});
    if(fvotesForId) {
      // User already voted -> Update vote
      FeedbackVotes.update({
        feedbackId: feedbackId,
        userId: Meteor.userId()
      }, {
        $set: {vote: vote}
      });
    } else {
      //User has not voted -> add new user vote
      FeedbackVotes.insert({
        feedbackId: feedbackId,
        userId: Meteor.userId(),
        vote: vote
      });
    }
  }
});
