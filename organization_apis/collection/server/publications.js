import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Organizations } from '/organizations/collection';
import { _ } from 'lodash';
import { Apis } from '/apis/collection';
import { OrganizationApis } from '../';

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
    const apiIds = _.map(organizationApis, function (organizationApiLink) {
      // Get API ID from link document
      return organizationApiLink.apiId;
    });

    // Get a database cursor of APIs using the API IDs array
    apis = Apis.find({ _id: { $in: apiIds } });
  }

  // Return organizationApis (empty array or cursor)
  return apis;
});

Meteor.publish('organizationApisByApiId', (apiId) =>
  // Return cursor to organizationApis
  OrganizationApis.find({ apiIds: { $in: [apiId] } }));
