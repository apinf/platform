import { Template } from 'meteor/templating';
import { Organizations } from '/organizations/collection';
import { OrganizationApis } from '../../collection';

Template.apiOrganization.onCreated(function () {
  // Get reference to template instance
  const instance = this;

  instance.subscribe('organizationApisByApiId', instance.data.api._id);
});

Template.apiOrganization.helpers({
  userIsOrganizationManager () {
    const organizationsCount = Organizations.find().count();

    return organizationsCount > 0;
  },
  organizationApis () {
    // Return Organization APIs document, if available
    return OrganizationApis.findOne();
  },
});
