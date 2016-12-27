import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { OrganizationApis } from './';

OrganizationApis.schema = new SimpleSchema({
  organizationId: {
    type: String,
    optional: true,
  },
  apiIds: {
    type: [String],
    optional: true,
  },
});

// Internationalize schema texts
OrganizationApis.schema.i18n('schemas.OrganizationApis');

// Attach schema to collection
OrganizationApis.attachSchema(OrganizationApis.schema);
