import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Organizations } from '/organizations/collection';
import { _ } from 'lodash';
import { Apis } from '/apis/collection';
import { OrganizationApis } from '../';

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

Meteor.publish('organizationApis', (slug) => {
  // Make sure slug argument is a String
  check(slug, String);

  // Init organizationApis
  let organizationApis;

  // Initialize apis as empty array, to complete the publication if no results
  let apis = [];

  // Get organization
  const organization = Organizations.findOne({ slug });

  // Check organization exist
  if (organization) {
    // Get all links between this organization and APIs
    organizationApis = OrganizationApis.find({ organizationId: organization._id }).fetch();

    // Create an array of API IDs
    const apiIds = _.map(organizationApis, organizationApiLink => {
      // Get API ID from link document
      return organizationApiLink.apiId;
    });

    // Get a database cursor of APIs using the API IDs array
    apis = Apis.find({ _id: { $in: apiIds } });
  }

  // Return organizationApis (empty array or cursor)
  return apis;
});

Meteor.publish('organizationApisByApiId', (apiId) => {
  // Return cursor to organizationApis
  OrganizationApis.find({ apiId });
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
