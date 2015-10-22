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
  author: {
    type: String,
    autoValue: function () {
      return Meteor.userId()
    }
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
