import { Branding } from './';

Branding.schema = new SimpleSchema({
  projectLogoFileId: {
    type: String,
    optional: true
  },
  siteTitle: {
    type: String,
    optional: true
  },
  siteSlogan: {
    type: String,
    optional: true
  },
  siteFooter: {
    type: String,
    optional: true
  },
  socialMedia: {
    type: [Object],
    optional: true
  },
  "socialMedia.$.name": {
    type: String,
    allowedValues: ["Facebook", "Twitter", "Github"]
  },
  "socialMedia.$.url": {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    autoform: {
      placeholder: 'http://example.com/accountname'
    }
  }
});

// i18n translation
Branding.schema.i18n("schemas.branding");

Branding.attachSchema(Branding.schema);
