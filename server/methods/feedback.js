Meteor.methods({
  'deleteFeedback': function(feedbackId) {
    // Removing feedback from collection
    Feedback.remove(feedbackId);
  },
  'submitVote': function(feedbackId, vote) {
    // Get current User ID
    var userId = Meteor.userId();
    
    // Get feedback vote for current User / Feedback ID
    var userVote = FeedbackVotes.findOne({feedbackId: feedbackId, userId: userId});
    
    // If user has voted
    if(userVote) {
      // Get existing vote value
      var existingVote = userVote.vote;
      
      // If the existing vote is not same as submitted vote, update users vote.
      if(vote !== existingVote) {
        // Update existing vote, replacing the existing value with new value
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
