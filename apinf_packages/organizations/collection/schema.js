/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor contributed packages imports
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

// Collection imports
import Organizations from './';

// APInf imports
import contactPhone from './regex';

Organizations.schema = new SimpleSchema({
  contact: {
    type: Object,
    optional: true,
  },
  'contact.person': {
    type: String,
    optional: true,
  },
  'contact.phone': {
    type: String,
    regEx: contactPhone,
    optional: true,
  },
  'contact.email': {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    optional: true,
  },
  description: {
    type: String,
    max: 1000,
    autoform: {
      rows: 3,
    },
    optional: true,
  },
  isPublic: {
    type: Boolean,
    optional: true,
    defaultValue: false,
  },
  managerIds: {
    type: [String],
    regEx: SimpleSchema.RegEx.Id,
    autoform: {
      type: 'hidden',
      label: false,
    },
  },
  emailVerification: {
    type: [Object],
    optional: true,
  },
  'emailVerification.$.managerIds': {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    autoform: {
      type: 'hidden',
      label: false,
    },
  },
  'emailVerification.$.verified': {
    type: Boolean,
  },
  'emailVerification.$.verificationToken': {
    type: String,
    optional: true,
  },
  name: {
    type: String,
    optional: false,
    unique: true,
  },
  organizationLogoFileId: {
    type: String,
    optional: true,
  },
  slug: {
    type: String,
    optional: true,
  },
  url: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
  },
  /* Internal fields, create, update tracking */
  createdBy: {
    type: String,
    denyUpdate: true,
  },
  createdAt: {
    type: Date,
    optional: true,
    autoValue () {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return { $setOnInsert: new Date() };
      }
      // Prevent user from supplying their own value
      return this.unset();
    },
  },
  updatedAt: {
    type: Date,
    optional: true,
    autoValue () {
      if (this.isUpdate) {
        return new Date();
      }
      return this.unset();
    },
  },
  mediaPerPage: {
    type: Number,
    optional: true,
    autoform: {
      options () {
        return [
          { label: '4', value: 4 },
          { label: '8', value: 8 },
          { label: '12', value: 12 },
          { label: '16', value: 16 },
          { label: '20', value: 20 },
          { label: '24', value: 24 },
        ];
      },
    },
  },
  apisPerPage: {
    type: Number,
    optional: true,
    autoform: {
      options () {
        return [
          { label: '4', value: 4 },
          { label: '8', value: 8 },
          { label: '12', value: 12 },
          { label: '16', value: 16 },
          { label: '20', value: 20 },
          { label: '24', value: 24 },
        ];
      },
    },
  },
  organizationCoverFileId: {
    type: String,
    optional: true,
  },
  socialMedia: {
    type: Object,
    optional: true,
  },
  'socialMedia.facebook': {
    type: String,
    optional: true,
  },
  'socialMedia.twitter': {
    type: String,
    optional: true,
  },
  'socialMedia.instagram': {
    type: String,
    optional: true,
  },
  'socialMedia.linkedIn': {
    type: String,
    optional: true,
  },
  featuredApiIds: {
    type: [String],
    optional: true,
    defaultValue: [],
    maxCount: 4,
  },
  'friendlySlugs.slug.base': {
    type: String,
    optional: true,
  },
  'friendlySlugs.slug.index': {
    type: Number,
    optional: true,
  },
});

// Enable translations (i18n)
Organizations.schema.i18n('schemas.organizations');

Organizations.attachSchema(Organizations.schema);
