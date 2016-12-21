import { Organizations } from '/organizations/collection';
import { OrganizationApis } from './';

OrganizationApis.schema = new SimpleSchema({
  organizationId: {
    type: String,
    optional: true,
    autoform: {
      options () {
        return _.map(Organizations.find().fetch(), (organization) => ({
          label: organization.name,
          value: organization._id,
        }));
      },
    },
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
