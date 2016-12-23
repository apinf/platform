// TODO: Remove it
import { OrganizationApis } from '/organizations/collection';

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


// Attach schema to collection
OrganizationApis.attachSchema(OrganizationApis.schema);
