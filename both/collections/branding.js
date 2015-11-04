Branding = new Mongo.Collection('branding');

Schemas.BrandingSchema = new SimpleSchema({
  logo: {
    type: String,
    optional: true
  },
  primary_color: {
    type: Number,
    optional: true
  },
  second_color: {
    type: Number,
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
