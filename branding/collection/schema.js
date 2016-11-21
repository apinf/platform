import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Branding } from './';

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
  siteTitle: {
    type: String,
    optional: true,
  },
  siteSlogan: {
    type: String,
    optional: true,
  },
  siteFooter: {
    type: String,
    optional: true,
  },
  socialMedia: {
    type: [Object],
    optional: true,
  },
  'socialMedia.$.name': {
    type: String,
    optional: true,
    allowedValues: ['Facebook', 'Twitter', 'Github'],
  },
  'socialMedia.$.url': {
    type: String,
    optional: true,
    regEx: SimpleSchema.RegEx.Url,
    autoform: {
      placeholder: 'http://example.com/accountname',
    },
  },
});

// i18n translation
Branding.schema.i18n('schemas.branding');

Branding.attachSchema(Branding.schema);
