ApiMetadata = new Mongo.Collection("apiMetadata");

ApiMetadata.schema = new SimpleSchema({
  "apiBackendId": {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  }
});
