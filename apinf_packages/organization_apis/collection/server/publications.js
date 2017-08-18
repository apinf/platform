/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

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

  if (organization) {
    // Get Organization ID
    const organizationId = organization._id;

    // Return cursor to organizationApis
    return OrganizationApis.find({ organizationId });
  }
  return [];
});

Meteor.publish('organizationApis', () => {
  // Return cursor to organizationApis
  return OrganizationApis.find();
});
