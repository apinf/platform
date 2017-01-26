import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Counts } from 'meteor/tmeasday:publish-counts';

import OrganizationApis from '/organization_apis/collection';
import Organizations from '../';

Meteor.publish('singleOrganization', (slug) => {
  // Make sure 'slug' is a String
  check(slug, String);

  // Make sure slug was passed in
  if (slug) {
    // Return an organization matching the slug
    return Organizations.find({ slug });
  }

  // Otherwise, return an empty array to trigger subscription 'ready'
  return [];
});

Meteor.publish('allOrganizationBasicDetails', () => {
  return Organizations.find({},
    {
      fields: {
        _id: 1,
        name: 1,
        description: 1,
        contact: 1,
      },
    });
});

// Publish collection for pagination
// TODO: Determine if there is a better way to handle pagination
// eslint-disable-next-line no-new
new Meteor.Pagination(Organizations);

Meteor.publish('userManagedOrganizations', function () {
  return Organizations.find({ managerIds: this.userId });
});

Meteor.publish('organizationApisCount', function (organizationId) {
  // Make sure 'organizationId' is a String
  check(organizationId, String);
  // Publish count of organization apis
  const organizationApisCount = OrganizationApis.find({ organizationId });
  // Publish an Api Counter for each Organization
  Counts.publish(this, `organizationApisCount-${organizationId}`, organizationApisCount);
});
