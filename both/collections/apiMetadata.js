ApiMetadata = new Mongo.Collection("apiMetadata");

ApiMetadata.schema = new SimpleSchema({
  "apiBackendId": {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  "organization": {
    type: Object
  },
  "organization.name": {
    type: String
  },
  "organization.description": {
    type: String
  }
});

ApiMetadata.attachSchema(ApiMetadata.schema);
