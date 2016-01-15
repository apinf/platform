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
  },
  "contactInformation": {
    type: Object
  },
  "contactInformation.name": {
    type: String
  },
  "contactInformation.phone": {
    type: String
  },
  "contactInformation.email": {
    type: String
  },
  "service": {
    type: Object
  },
  "service.name": {
    type: String
  },
  "service.description": {
    type: String
  },
  "service.validSince": {
    type: Date
  },
  "service.validUntil": {
    type: Date
  },
  "service.serviceLevelAgreement": {
    type: String
  }
});

ApiMetadata.attachSchema(ApiMetadata.schema);
