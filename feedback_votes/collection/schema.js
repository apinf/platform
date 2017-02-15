// Meteor packages imports
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

// Collection imports
import FeedbackVotes from './';

FeedbackVotes.schema = new SimpleSchema({
  /*
  feedbackId - string - the ID of the Feedback document
  userId - string - the ID of the user
  vote - integer - the numeric vote for the user (allowed values: 1 and -1)
  */
  feedbackId: {
    type: String,
  },
  userId: {
    type: String,
  },
  vote: {
    type: Number,
    allowedValues: [1, -1],
  },
});

FeedbackVotes.attachSchema(FeedbackVotes.schema);
