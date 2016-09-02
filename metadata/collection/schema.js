import { ApiMetadata } from '/metadata/collection/collection';

ApiMetadata.schema = new SimpleSchema({
  // TODO: migrate to use 'apiId' instead of 'apiBackendId'
  'apiBackendId': {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  'organization': {
    type: Object,
    optional: true,
  },
  'organization.name': {
    type: String,
    optional: true,
  },
  'organization.description': {
    type: String,
    optional: true,
  },
  'contact': {
    type: Object,
    optional: true,
  },
  'contact.name': {
    type: String,
    optional: true,
  },
  'contact.phone': {
    type: String,
    optional: true,
  },
  'contact.email': {
    type: String,
    optional: true,
  },
  'service': {
    type: Object,
    optional: true,
  },
  'service.name': {
    type: String,
    optional: true,
  },
  'service.description': {
    type: String,
    optional: true,
  },
  'service.validSince': {
    type: Date,
    optional: true,
  },
  'service.validUntil': {
    type: Date,
    optional: true,
  },
  'service.serviceLevelAgreement': {
    type: String,
    optional: true,
  },
});

// Enable translations (i18n)
ApiMetadata.schema.i18n('schemas.apiMetadata');

ApiMetadata.attachSchema(ApiMetadata.schema);
