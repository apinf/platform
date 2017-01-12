import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Organizations } from '../';

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
new Meteor.Pagination(Organizations);

Meteor.publish('userManagedOrganizations', function () {
  return Organizations.find({ managerIds: this.userId });
});
