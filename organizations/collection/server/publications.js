import { Meteor } from 'meteor/meteor';
import { Organizations } from '../';

Meteor.publish('singleOrganization', (slug) => Organizations.find({ slug }));
