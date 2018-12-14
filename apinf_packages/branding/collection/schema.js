/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

// Collection imports
import Branding from './';

Branding.schema = new SimpleSchema({
  projectLogoFileId: {
    type: String,
    optional: true,
  },
  coverPhotoFileId: {
    type: String,
    optional: true,
  },
  colors: {
    type: Object,
    optional: true,
  },
  'colors.primary': {
    type: String,
    optional: true,
    defaultValue: '#2655C9',
    autoform: {
      type: 'bootstrap-colorpicker',
    },
  },
  'colors.primaryText': {
    type: String,
    optional: true,
    defaultValue: '#ffffff',
    autoform: {
      type: 'bootstrap-colorpicker',
    },
  },
  'colors.coverPhotoOverlay': {
    type: String,
    optional: true,
    defaultValue: '#ffffff',
    autoform: {
      type: 'bootstrap-colorpicker',
    },
  },
  'colors.overlayTransparency': {
    type: Number,
    min: 0,
    max: 100,
    optional: true,
    defaultValue: 0,
    autoform: {
      type: 'number',
    },
  },
  siteTitle: {
    type: String,
    optional: true,
  },
  siteSlogan: {
    type: String,
    optional: true,
  },
  featuredApis: {
    type: [String],
    optional: true,
    maxCount: 8,
  },
  homeCustomBlock: {
    type: String,
    optional: true,
    autoform: {
      rows: 5,
    },
  },
  siteFooter: {
    type: String,
    optional: true,
  },
  privacyPolicy: {
    type: String,
    optional: true,
    autoform: {
      rows: 5,
    },
  },
  termsOfUse: {
    type: String,
    optional: true,
    autoform: {
      rows: 5,
    },
  },
  socialMediaLinks: {
    type: Object,
    optional: true,
  },
  'socialMediaLinks.facebook': {
    type: String,
    optional: true,
    regEx: SimpleSchema.RegEx.Url,
  },
  'socialMediaLinks.twitter': {
    type: String,
    optional: true,
    regEx: SimpleSchema.RegEx.Url,
  },
  'socialMediaLinks.github': {
    type: String,
    optional: true,
    regEx: SimpleSchema.RegEx.Url,
  },
  analyticCode: {
    type: String,
    optional: true,
  },
});

// i18n translation
Branding.schema.i18n('schemas.branding');

Branding.attachSchema(Branding.schema);
