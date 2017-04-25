import { SimpleSchema } from 'meteor/aldeed:simple-schema';

// Rate limits schema
const RateLimitSchema = new SimpleSchema({
  allow: {
    type: Number,
    allowedValues: [
      0,
      1,
    ],
    optional: false,
  },
  ip_addr: {
    type: String,
    optional: true,
  },
  username: {
    type: String,
    optional: true,
  },
  client_id: {
    type: String,
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
  },
});

// Settings schema
const SettingsSchema = new SimpleSchema({
  rate_limits: {
    type: [RateLimitSchema],
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
