import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { OrganizationApis } from './';

OrganizationApis.schema = new SimpleSchema({
  organizationId: {
    type: String,
    optional: false,
  },
  apiIds: {
    type: [String],
    optional: false,
  },
});

// Internationalize schema texts
OrganizationApis.schema.i18n('schemas.OrganizationApis');

// Attach schema to collection
OrganizationApis.attachSchema(OrganizationApis.schema);
