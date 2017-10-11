/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

// Collection imports
import EntityComment from './';

EntityComment.schema = new SimpleSchema({
  postId: {
    type: String,
    optional: true,
  },
  type: {
    type: String,
    optional: true,
  },
  comment: {
    type: String,
    max: 1000,
    optional: false,
    autoform: {
      rows: 5,
    },
  },
  commentedOn: {
    type: String,
    denyUpdate: true,
    optional: true,
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
EntityComment.schema.i18n('schemas.entityComment');

EntityComment.attachSchema(EntityComment.schema);
