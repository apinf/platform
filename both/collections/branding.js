Branding = new Mongo.Collection('branding');

Schemas.BrandingSchema = new SimpleSchema({
  projectLogo: {
    type: String,
    label: 'Project Logo',
    optional: true,
    autoform: {
      afFieldInput: {
        type: 'fileUpload',
        collection: 'ProjectLogo'
      }
    }
  },
  color_theme: {
    type: String,
    optional: true,
    allowedValues: [
      'blue-light',
      'blue',
      'black-light',
      'black',
      'green-light',
      'green',
      'purple-light',
      'purple',
      'red-light',
      'red',
      'yellow-light',
      'yellow'
    ],
    label: 'Choose you color theme'
  },
  siteTitle: {
    type: String,
    optional: true,
    label: 'Site title'
  },
  siteAbbreviation: {
    type: String,
    optional: true,
    label: 'Site abbreviation'
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

Branding.attachSchema(Schemas.BrandingSchema);

Branding.allow({
  insert: function (userId) {
    return Roles.userIsInRole(userId, ['admin']) && Branding.find().count() === 0;
  },
  update: function (userId) {
    return Roles.userIsInRole(userId, ['admin']);
  },
  remove: function (userId) {
    return Roles.userIsInRole(userId, ['admin']);
  }
});
