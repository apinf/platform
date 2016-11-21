import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Organizations } from './';

Organizations.schema = new SimpleSchema({
  organizationLogoFileId: {
    type: String,
    optional: true,
  },
  name: {
    type: String,
  },
  url: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
  },
  username: {
    type: String,
  },
  desctipion: {
    type: String,
    max: 1000,
    autoform: {
      rows: 3,
    },
    optional: true,
  },
  contactPerson: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
  },
});

Organizations.attachSchema(Organizations.schema);
