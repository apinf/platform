import { Meteor } from 'meteor/meteor';
import { Organizations } from '/organizations/collection';
import { OrganizationApis } from '../';

Meteor.publish('organizationApis', (slug) => {
  // Init organizationApis
  let organizationApis = [];
  // Get organization
  const organization = Organizations.findOne({ slug });
  // Check organization exist
  if (organization) {
    // Get cursor to organizationApis
    organizationApis = OrganizationApis.find({ organizationId: organization._id });
  }
  // Return organizationApis (empty array or cursor)
  return organizationApis;
});

Meteor.publish('organizationApisByApiId', (apiId) =>
  // Return cursor to organizationApis
  OrganizationApis.find({ apiIds: { $in: [apiId] } }));
