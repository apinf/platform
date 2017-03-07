// Meteor packages imports
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

// Npm packages imports
import { _ } from 'lodash';

// Collection imports
import Organizations from '/organizations/collection';
import OrganizationApis from './';

OrganizationApis.schema = new SimpleSchema({
  organizationId: {
    type: String,
    optional: false,
    autoform: {
      options () {
        // Get all organizations, available in data context
        const organizations = Organizations.find().fetch();

        // Create array of options with label/value attributes
        const organizationOptions = _.map(organizations, (organization) => {
          return {
            label: organization.name,
            value: organization._id,
          };
        });

        return organizationOptions;
      },
    },
  },
  apiId: {
    type: String,
    optional: false,
  },
});

// Internationalize schema texts
OrganizationApis.schema.i18n('schemas.organizationApis');

// Attach schema to collection
OrganizationApis.attachSchema(OrganizationApis.schema);
