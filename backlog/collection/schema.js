// Meteor packages imports
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

// Collection imports
import ApiBacklogItems from './';

ApiBacklogItems.schema = new SimpleSchema({
  title: {
    type: String,
    label: 'Title',
    max: 100,
    autoform: {
      placeholder: 'Title',
    },
  },
  details: {
    type: String,
    label: 'Details',
    max: 1000,
    autoform: {
      rows: 5,
      placeholder: 'Description',
    },
  },
  priority: {
    type: Number,
    label: 'Priority',
    min: 0,
    max: 2,
    autoform: {
      options: [
        { label: 'High', value: 2 },
        { label: 'Middle', value: 1 },
        { label: 'None', value: 0 },
      ],
    },
  },
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    autoValue () {
      return Meteor.userId();
    },
  },
  apiBackendId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true,
  },
  createdAt: {
    type: Date,
    autoValue () {
      let value;
      // Check if mongoDB insert operation is initial
      if (this.isInsert) {
        value = new Date();
      } else if (this.isUpsert) {
        value = { $setOnInsert: new Date() };
      } else {
        // Prevent user from supplying their own value
        this.unset();
      }
      return value;
    },
  },
  updatedAt: {
    type: Date,
    autoValue () {
      return new Date();
    },
  },
});

// Attach schema to collection for validation, etc.
ApiBacklogItems.attachSchema(ApiBacklogItems.schema);
