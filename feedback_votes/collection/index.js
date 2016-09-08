FeedbackVotes = new Mongo.Collection('feedbackVotes');

Schemas.FeedbackVotesSchema = new SimpleSchema({
  /*
  feedbackId - string - the ID of the Feedback document
  userId - string - the ID of the user
  vote - integer - the numeric vote for the user (allowed values: 1 and -1)
  */
  feedbackId: {
    type: String
  },
  userId: {
    type: String
  },
  vote: {
    type: Number,
    allowedValues: [1,-1]
  }
});

FeedbackVotes.attachSchema(Schemas.FeedbackVotesSchema);

FeedbackVotes.allow({
  insert: function () {
    // Only allow logged in user to vote
    if (Meteor.userId) {
      return true;
    }
  },
  update: function () {
    // TODO: only allow user to update own vote
    if (Meteor.userId) {
      return true;
    }
  },
  remove: function () {
    // TODO: only allow user to remove own vote
    if (Meteor.userId) {
      return true;
    }
  }
});
