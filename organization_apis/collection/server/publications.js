import { Meteor } from 'meteor/meteor';
import { Organizations } from '/organizations/collection';
import { OrganizationApis } from '../';

Meteor.publish('singleOrganizationApis', (slug) => {
  let organizationApis = {};
  // Get organization
  const organization = Organizations.findOne({ slug });
  // Check organization exist
  if (organization) {
    organizationApis = OrganizationApis.find({ organizationId: organization._id });
  }
  // Return cursor to organizationApis
  return organizationApis;
});
