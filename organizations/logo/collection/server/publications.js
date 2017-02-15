// Collection imports
import OrganizationLogo from '/organizations/logo/collection/collection';

Meteor.publish('allOrganizationLogo', () => {
  return OrganizationLogo.find({
    'metadata._Resumable': {
      $exists: false,
    },
  });
});
