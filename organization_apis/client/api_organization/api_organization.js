import { Template } from 'meteor/templating';
import { Organizations } from '/organizations/collection';
import { OrganizationApis } from '../../collection';

Template.apiOrganization.onCreated(function () {
  // Get reference to template instance
  const instance = this;

  // Subscribe to user managed organizations, controls template visibility
  instance.subscribe('userManagedOrganizations');

  instance.subscribe('organizationApisByApiId', instance.data.api._id);
});

Template.apiOrganization.helpers({
  userIsOrganizationManager () {
    // Get current User ID
    const userId = Meteor.userId;

    // Get organizations where User is manager
    const organizations = Organizations.find({ managerIds: userId });

    // Make sure user is manager of at least one organization
    return (organizations.count() > 0);
  },
  organizationApis () {
    // Return Organization APIs document, if available
    return OrganizationApis.findOne();
  },
});
