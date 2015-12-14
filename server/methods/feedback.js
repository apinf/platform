Meteor.methods({
  'deleteFeedback': function(feedbackId) {
    // Removing feedback from collection
    Feedback.remove(feedbackId);
  },
  'submitVote': function(feedbackId, vote) {
    var userId = Meteor.userId();
    var userVote = FeedbackVotes.findOne({feedbackId: feedbackId, userId: userId});
    if(userVote) {
      var existingVote = userVote.vote;
      // If the existing vote is not same as submitted vote, update users vote.
      if(vote !== existingVote) {
        FeedbackVotes.update({
          feedbackId: feedbackId,
          userId: Meteor.userId()
        }, {
          $set: {vote: vote}
        });
      // Otherwise cancel/remove the vote.
      } else {
        FeedbackVotes.remove(userVote._id);
      }
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
