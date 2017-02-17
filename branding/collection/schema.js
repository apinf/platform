import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { TAPi18n } from 'meteor/tap:i18n';

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
});

// i18n translation
Branding.schema.i18n('schemas.branding');

Branding.attachSchema(Branding.schema);
