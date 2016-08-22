import { Branding } from './';

Branding.schema = new SimpleSchema({
  projectLogoFileId: {
    type: String,
    optional: true
  },
  siteTitle: {
    type: String,
    optional: true,
    label: 'Site title'
  },
  siteSlogan: {
    type: String,
    optional: true,
    label: 'Site slogan'
  },
  siteFooter: {
    type: String,
    optional: true,
    label: 'Site footer'
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

Branding.attachSchema(Branding.schema);
