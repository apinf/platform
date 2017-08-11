// Meteor packages imports
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { TAPi18n } from 'meteor/tap:i18n';

// Collection imports
import ApiMetadata from '/metadata/collection';
import contactPhone from '/organizations/collection/regex';

ApiMetadata.schema = new SimpleSchema({
  apiId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
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
    regEx: contactPhone,
    optional: true,
  },
  'contact.email': {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
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
