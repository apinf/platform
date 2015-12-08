Meteor.methods({
  'deleteFeedback': function(feedbackId) {
    // Removing feedback from collection
    Feedback.remove(feedbackId);
  },
  'submitVote': function(feedbackId, vote) {
    //check whether user has already voted
    var fvotesForId = FeedbackVotes.find(feedbackId).fetch();
    for(fvote in fvotesForId) {
      if(fvote.userId === Meteor.userId()) {
        // User already voted -> Update vote
        FeedbackVotes.update({
          feedbackId: feedbackId,
          userId: Meteor.userId()
        }, {
          $set: {vote: vote}
        });
        return;
      }
    }
    //User has not voted -> add new user vote
    FeedbackVotes.insert({
      feedbackId: feedbackId,
      userId: Meteor.userId(),
      vote: vote
    });
  }
});
