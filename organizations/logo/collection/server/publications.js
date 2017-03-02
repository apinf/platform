// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Collection imports
import OrganizationLogo from '/organizations/logo/collection/collection';

Meteor.publish('allOrganizationLogo', () => {
  return OrganizationLogo.find({
    'metadata._Resumable': {
      $exists: false,
    },
  });
});
