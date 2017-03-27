/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Meteor contributed packages imports
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { TAPi18n } from 'meteor/tap:i18n';

// Collection imports
import ApiBacklogItems from './';

ApiBacklogItems.schema = new SimpleSchema({
  title: {
    type: String,
    max: 100,
  },
  details: {
    type: String,
    max: 1000,
    autoform: {
      rows: 5,
    },
  },
  priority: {
    type: Number,
    min: 0,
    max: 2,
    autoform: {
      options: [
        {
          // Return the translated label
          label () { return TAPi18n.__('apiBacklogItems_priorityText_High'); },
          value: 2,
        },
        {
          // Return the translated label
          label () { return TAPi18n.__('apiBacklogItems_priorityText_Middle'); },
          value: 1,
        },
        {
          // Return the translated label
          label () { return TAPi18n.__('apiBacklogItems_priorityText_None'); },
          value: 0,
        },
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

// Attach translation
ApiBacklogItems.schema.i18n('schemas.backlog');

// Attach schema to collection for validation, etc.
ApiBacklogItems.attachSchema(ApiBacklogItems.schema);
