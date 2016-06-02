import ss from 'simple-statistics';

Feedback = new Mongo.Collection('feedback');

Schemas.FeedbackSchema = new SimpleSchema({
  topic: {
    type: String,
    label: "Topic",
    max: 50,
    optional: false,
    autoform: {
      placeholder: 'Feedback topic'
    }
  },
  message: {
    type: String,
    label: "Your Message",
    max: 1000,
    optional: false,
    autoform: {
      rows: 5,
      placeholder: 'Your message'
    }
  },
  messageType: {
    type: String,
    label: "Choose message type",
    allowedValues: ['Feedback', 'Error report', 'Feature request'],
    autoform: {
      options: [
        {label: "Feedback", value: "Feedback"},
        {label: "Error report", value: "Error report"},
        {label: "Feature request", value: "Feature request"}
      ]
    }
  },
  authorId: {
    type: String,
    autoValue: function() {
      if (this.isInsert) {
        return Meteor.userId();
      } else {
        this.unset();
      }
    },
    denyUpdate: true
  },
  apiBackendId: {
    type: String
  },
  createdAt: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date()};
      } else {
        this.unset();
      }
    }
  }
});

Feedback.attachSchema(Schemas.FeedbackSchema);

Feedback.allow({
  insert: function () {
    return true;
  }
});

Feedback.helpers({
  'sumOfVotes': function () {
    // Get all votes for current feedback
    var feedbacks = FeedbackVotes.find({feedbackId: this._id}).fetch();

    // Create a list of all feedback vote values
    var votes = _(feedbacks).map(function(feedback){
      return feedback.vote;
    });

    // Calculate the sum of all vote values
    var sum = ss.sum(votes);
    return sum;
  }
});
