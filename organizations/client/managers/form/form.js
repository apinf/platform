import { managerSchema } from './schema';

Template.addOrganizationManagerForm.helpers({
  organizationId () {
    const organizationId = Template.instance().data.organization._id;
    return organizationId;
  },
  managerSchema () {
    return managerSchema;
  },
});

Template.addOrganizationManagerForm.events({
  'submit #organizationManagerForm' (event) {
    // Prevent form from reloading page
    event.preventDefault();
  }
});
