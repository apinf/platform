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
  primary_color: {
    type: String,
    optional: true
  },
  second_color: {
    type: String,
    optional: true
  }
});

Branding.attachSchema(Schemas.BrandingSchema);

Branding.allow({
  insert: function () {
    return true;
  },
  update: function () {
    return true;
  },
  remove: function () {
    return true;
  }
});
