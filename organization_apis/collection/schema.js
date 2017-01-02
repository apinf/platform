import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { OrganizationApis } from './';
import { Organizations } from '/organizations/collection';

OrganizationApis.schema = new SimpleSchema({
  organizationId: {
    type: String,
    optional: false,
    unique: true,
    autoform: {
      options: function () {
        // Get all organizations, available in data context
        const organizations = Organizations.find().fetch();

        // Create array of options with label/value attributes
        const organizationOptionss = _.map(organizations, (organization) => ({
          label: organization.name,
          value: organization._id,
        }));

        return organizationOptionss;
      },
    }
  },
  apiIds: {
    type: [String],
    optional: false,
  },
});

// Internationalize schema texts
OrganizationApis.schema.i18n('schemas.organizationApis');

// Attach schema to collection
OrganizationApis.attachSchema(OrganizationApis.schema);
