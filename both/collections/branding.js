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
    label: 'Choose you color theme:'
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
