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

Meteor.publish('organizationApis', function(slug) {
  // Make sure slug argument is a String
  check(slug, String);

  // Get organization
  const organization = Organizations.findOne({ slug });

  // Check organization exist
  if (organization) {
    // Set cursor to all links between this organization and APIs
    const cursor = OrganizationApis.find({ organizationId: organization._id });

    // Get data from cursor
    const organizationApis = cursor.fetch();
    // Create an array of API IDs
    const apiIds = _.map(organizationApis, organizationApiLink => {
      // Get API ID from link document
      return organizationApiLink.apiId;
    });

    // Get collection name for APIs collection
    const collectionName = Apis.rawCollection().collectionName;
    // Follow on changing of organizationAPis DB cursor
    const handler = cursor.observe({
      // Describe 'added' event
      added: (doc) => {
        // Get id of added API in organizationApi
        const id = doc.apiId;
        // Check that current API
        if (apiIds.indexOf(id) < 0) {
          // Get related API
          const apiDocument = Apis.findOne({ _id: id });
          // Add API to Mongo on client-side
          this.added(collectionName, id, apiDocument);
          // Update list of API ids
          apiIds.push(id);
        }
      },
    });

    // Stop observe when subscription was stopped
    this.onStop(() => {
      handler.stop();
    });

    // Return a database cursor of APIs using the API IDs array
    return Apis.find({ _id: { $in: apiIds } });
  }

  // Otherwise, return an empty array so the publication can be marked as 'ready'
  return [];
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
