Branding = new Mongo.Collection('branding');

Schemas.BrandingSchema = new SimpleSchema({
  // projectLogo: {
  //   type: String,
  //   label: 'Project logo',
  //   optional: true,
  //   autoform: {
  //     afFieldInput: {
  //       type: 'fileUpload',
  //       collection: 'ProjectLogo'
  //     }
  //   }
  // },
  // coverPhoto: {
  //   type: String,
  //   label: 'Cover photo',
  //   optional: true,
  //   autoform: {
  //     afFieldInput: {
  //       type: 'fileUpload',
  //       collection: 'CoverPhoto'
  //     }
  //   }
  // },
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
