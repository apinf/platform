import { SimpleSchema } from 'meteor/aldeed:simple-schema';

// Meteor contributed packages imports
import { TAPi18n } from 'meteor/tap:i18n';

// Rate limits schema
const aclSchema = new SimpleSchema({
  id: {
    type: String,
    optional: true,
  },
  allow: {
    type: Number,
    allowedValues: [
      0,
      1,
    ],
    optional: false,
  },
  access: {
    type: Number,
    allowedValues: [
      1,
      2,
      3,
    ],
  },
  topic: {
    type: String,
    autoform: {
      placeholder: 'Topic',
    },
  },
  fromType: {
    type: String,
    autoform: {
      type: 'select',
      options () {
        return [
          {
            label: TAPi18n.__('schemas.proxyBackends.emq.settings.acl.$.client_id.label'),
            value: 'clientid',
          },
          {
            label: TAPi18n.__('schemas.proxyBackends.emq.settings.acl.$.username.label'),
            value: 'username',
          },
          {
            label: TAPi18n.__('schemas.proxyBackends.emq.settings.acl.$.ip_addr.label'),
            value: 'ipaddr',
          },
        ];
      },
    },
  },
  fromValue: {
    type: String,
    autoform: {
      placeholder: 'Value',
    },
  },
});

// Settings schema
const SettingsSchema = new SimpleSchema({
  acl: {
    type: [aclSchema],
    optional: true,
  },
});

// EMQ Schema
const EmqSchema = new SimpleSchema({
  settings: {
    type: SettingsSchema,
    optional: true,
  },
});

export default EmqSchema;
