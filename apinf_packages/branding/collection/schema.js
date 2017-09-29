/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { TAPi18n } from 'meteor/tap:i18n';

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
    autoform: {
      type: 'bootstrap-colorpicker',
    },
  },
  'colors.primaryText': {
    type: String,
    optional: true,
    autoform: {
      type: 'bootstrap-colorpicker',
    },
  },
  'colors.coverPhotoOverlay': {
    type: String,
    optional: true,
    autoform: {
      type: 'bootstrap-colorpicker',
    },
  },
  'colors.overlayTransparency': {
    type: Number,
    min: 0,
    max: 100,
    optional: true,
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
    label:"featuredApis",
    autoform:{
      afFieldInput:{
        type: "select-multiple",
      },
    },
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
  socialMedia: {
    type: [Object],
    optional: true,
  },
  'socialMedia.$.name': {
    type: String,
    optional: true,
    allowedValues: ['Facebook', 'Twitter', 'Github'],
    autoform: {
      firstOption () {
        return TAPi18n.__('schemas.branding.socialMedia.$.name.firstOption');
      },
    },
  },
  'socialMedia.$.url': {
    type: String,
    optional: true,
    regEx: SimpleSchema.RegEx.Url,
  },
  footerCode: {
    type: String,
    optional: true,
    autoform: {
      rows: 5,
    },
  },
});

// i18n translation
Branding.schema.i18n('schemas.branding');

Branding.attachSchema(Branding.schema);
