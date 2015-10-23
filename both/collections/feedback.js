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
    allowedValues: ['feedback', 'error_report', 'feature_request'],
    autoform: {
      options: [
        {label: "Feedback", value: "feedback"},
        {label: "Error report", value: "error_report"},
        {label: "Feature request", value: "feature_request"}
      ]
    }
  },
  author: {
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
