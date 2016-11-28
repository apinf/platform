import { Meteor } from 'meteor/meteor';
import { OrganizationLogo } from '/organizations/logo/collection/collection';

Meteor.publish('allOrganizationLogo', function() {
  return OrganizationLogo.find({
    'metadata._Resumable': {
      $exists: false,
    },
  });
});
