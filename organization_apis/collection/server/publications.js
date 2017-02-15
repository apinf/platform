// Collection imports
import Organizations from '/organizations/collection';
import OrganizationApis from '../';

Meteor.publish('apiOrganizationBasicDetails', (apiId) => {
  // Make sure API ID is a String
  check(apiId, String);

  // Placeholder for organization cursor, empty array in case of no results
  let organization = [];

  // Get link between organization and API
  const apiOrganizationLink = OrganizationApis.findOne({ apiId });

  if (apiOrganizationLink) {
    // Get organization ID from API / Organization link
    const organizationId = apiOrganizationLink.organizationId;

    // Get cursor to Organization document
    organization = Organizations.find({ _id: organizationId });
  }

  return organization;
});

Meteor.publish('organizationApisByApiId', (apiId) => {
  // Make sure API ID is String
  check(apiId, String);

  // Return cursor to organizationApis
  return OrganizationApis.find({ apiId });
});

Meteor.publish('organizationApiLinksByOrganizationSlug', (slug) => {
  // Make sure 'slug' is a string
  check(slug, String);

  // Get Organization document
  const organization = Organizations.findOne({ slug });

  // Get Organization ID
  const organizationId = organization._id;

  // Return cursor to organizationApis
  return OrganizationApis.find({ organizationId });
});

