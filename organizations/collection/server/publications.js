import { Meteor } from 'meteor/meteor';
import { Organizations } from '../';

Meteor.publish('singleOrganization', (slug) => Organizations.find({ slug }));

Meteor.publish('allOrganization', () => {
  return Organizations.find();
});

// Publish collection for pagination
new Meteor.Pagination(Organizations);
