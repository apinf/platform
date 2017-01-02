import { Template } from 'meteor/templating';

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
});
