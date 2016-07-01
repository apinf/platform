import { ApiBackends } from '/apis/collection/backend';

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

// Enable translations (i18n)
ApiMetadata.schema.i18n("schemas.apiMetadata");

ApiMetadata.attachSchema(ApiMetadata.schema);

ApiMetadata.allow({
  "insert": function (userId, doc) {
    var apiBackendId = doc.apiBackendId;
    // Make sure there is only one document per API Backend ID
    if(ApiMetadata.find({apiBackendId}).count() !== 0) {
      return false;
    } else {
      // Find related API Backend, select only "managerIds" field
      var apiBackend = ApiBackends.findOne(apiBackendId, {fields: {managerIds: 1}});

      // Check if current user can edit API Backend
      return apiBackend.currentUserCanEdit();
    }
  },
  "update": function (userId, doc) {
    // Get API Backend ID
    var apiBackendId = doc.apiBackendId;

    // Find related API Backend, select only "managerIds" field
    var apiBackend = ApiBackends.findOne(apiBackendId, {fields: {managerIds: 1}});

    // Check if current user can edit API Backend
    return apiBackend.currentUserCanEdit();
  }
});
