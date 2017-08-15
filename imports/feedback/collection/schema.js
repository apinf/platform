/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Meteor contributed packages imports
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

// Collection imports
import Feedback from './';

Feedback.schema = new SimpleSchema({
  topic: {
    type: String,
    max: 50,
    optional: false,
  },
  message: {
    type: String,
    max: 1000,
    optional: false,
    autoform: {
      rows: 5,
    },
  },
  messageType: {
    type: String,
    allowedValues: ['Feedback', 'Error report', 'Feature request'],
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

// Attache translation
Feedback.schema.i18n('schemas.feedback');

Feedback.attachSchema(Feedback.schema);
