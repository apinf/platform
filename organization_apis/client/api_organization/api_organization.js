Template.apiOrganization.helpers({
  userIsOrganizationManager () {
    const organizationsCount = Organizations.find().count();

    return organizationsCount > 0;
  },
});
