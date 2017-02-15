import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import Feedback from './';

Feedback.schema = new SimpleSchema({
  topic: {
    type: String,
    label: 'Topic',
    max: 50,
    optional: false,
    autoform: {
      placeholder: 'Feedback topic',
    },
  },
  message: {
    type: String,
    label: 'Your Message',
    max: 1000,
    optional: false,
    autoform: {
      rows: 5,
      placeholder: 'Your message',
    },
  },
  messageType: {
    type: String,
    label: 'Choose message type',
    allowedValues: ['Feedback', 'Error report', 'Feature request'],
    autoform: {
      options: [
        { label: 'Feedback', value: 'Feedback' },
        { label: 'Error report', value: 'Error report' },
        { label: 'Feature request', value: 'Feature request' },
      ],
    },
  },
  authorId: {
    type: String,
    autoValue () {
      let userId;
      if (this.isInsert) {
        userId = Meteor.userId();
      } else {
        this.unset();
      }
      return userId;
    },
    denyUpdate: true,
  },
  apiBackendId: {
    type: String,
  },
  createdAt: {
    type: Date,
    autoValue () {
      let now;
      if (this.isInsert) {
        now = new Date();
      } else if (this.isUpsert) {
        now = { $setOnInsert: new Date() };
      } else {
        this.unset();
      }
      return now;
    },
  },
});

Feedback.attachSchema(Feedback.schema);
