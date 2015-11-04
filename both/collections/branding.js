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

