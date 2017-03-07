// Meteor packages imports
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { TAPi18n } from 'meteor/tap:i18n';

// Collection imports
import ApiMetadata from '/metadata/collection';

ApiMetadata.schema = new SimpleSchema({
  // TODO: migrate to use 'apiId' instead of 'apiBackendId'
  apiBackendId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  organization: {
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
  contact: {
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
  service: {
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
    autoform: {
      type: 'bootstrap-datepicker',
    },
  },
  'service.validUntil': {
    type: Date,
    optional: true,
    autoform: {
      type: 'bootstrap-datepicker',
    },
    custom () {
      let validation;
      const validSince = this.field('service.validSince').value;
      const validUntil = this.value;

      // validUntil must be after validSince
      if (
        (validSince instanceof Date) &&
        (validUntil instanceof Date) &&
        validUntil < validSince
      ) {
        validation = 'dateError';
      }
      return validation;
    },
  },
  'service.serviceLevelAgreement': {
    type: String,
    optional: true,
  },
});

// Fetch dateInvalid message
const dateInvalid = TAPi18n.__('apiMetadata_dateInvalid');

// Define custom validation error messages
ApiMetadata.schema.messages({
  dateError: dateInvalid,
});

// Enable translations (i18n)
ApiMetadata.schema.i18n('schemas.apiMetadata');

ApiMetadata.attachSchema(ApiMetadata.schema);
