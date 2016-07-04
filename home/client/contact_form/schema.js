Schemas.contact = new SimpleSchema({
  name: {
    type: String,
    max: 50,
    optional: false
  },
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    optional: false
  },
  message: {
    type: String,
    max: 1000,
    optional: false,
    autoform: {
      rows: 5
    }
  }
});

// Enable translations (i18n)
ApiMetadata.schema.i18n("schemas.contact");
