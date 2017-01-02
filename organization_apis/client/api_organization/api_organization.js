Template.apiOrganizations.onCreated({
  // Get reference to template instance
  const instance = Template.instance();

  instance.subscribe('organizationApisByApiId', instance.data.api._id);
});

Template.apiOrganization.helpers({
  userIsOrganizationManager () {
    const organizationsCount = Organizations.find().count();

    return organizationsCount > 0;
  },
});
