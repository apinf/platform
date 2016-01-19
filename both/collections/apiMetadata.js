ApiMetadata = new Mongo.Collection("apiMetadata");

ApiMetadata.schema = new SimpleSchema({
  "apiBackendId": {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  "organization": {
    type: Object,
    optional: true
  },
  "organization.name": {
    type: String,
    optional: true
  },
  "organization.description": {
    type: String,
    optional: true
  },
  "contact": {
    type: Object,
    optional: true
  },
  "contact.name": {
    type: String,
    optional: true
  },
  "contact.phone": {
    type: String,
    optional: true
  },
  "contact.email": {
    type: String,
    optional: true
  },
  "service": {
    type: Object,
    optional: true
  },
  "service.name": {
    type: String,
    optional: true
  },
  "service.description": {
    type: String,
    optional: true
  },
  "service.validSince": {
    type: Date,
    optional: true
  },
  "service.validUntil": {
    type: Date,
    optional: true
  },
  "service.serviceLevelAgreement": {
    type: String,
    optional: true
  }
});

ApiMetadata.attachSchema(ApiMetadata.schema);

ApiMetadata.allow({
  "insert": function () {
    // TODO: add the following checks
    // Count existing API Metadata documents for API Backend ID
    // Make sure there is only one document per API Backend ID
    // Make sure user is API Backend manager or administrator
    return true;
  },
  "update": function () {
    // TODO: Add the following checks
    // Make sure user is manager for API Backend, or administrator
    return true;
  }
});
