import { Meteor } from 'meteor/meteor';
import { Organizations } from '../';

Meteor.publish('singleOrganization', (slug) => Organizations.find({ slug }));

Meteor.publish('allOrganizationBasicDetails', () => Organizations.find({},
  {
    fields: {
      _id: 1,
      name: 1,
      description: 1,
      contact: 1,
    },
  })
);

// Publish collection for pagination
new Meteor.Pagination(Organizations);

Meteor.publish('userManagedOrganizations', function () {
  return Organizations.find({ managerIds: this.userId });
});
