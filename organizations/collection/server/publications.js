import { Meteor } from 'meteor/meteor';
import { Organizations } from '../';

Meteor.publish('singleOrganization', (slug) => Organizations.find({ slug }));

// Publish collection for pagination
new Meteor.Pagination(Organizations);
