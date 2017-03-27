/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

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
