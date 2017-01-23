import { Template } from 'meteor/templating';
import { managerSchema } from './schema';

Template.addOrganizationManagerForm.helpers({
  organizationId () {
    // Get organization id from Template instance
    const organizationId = Template.instance().data.organization._id;
    return organizationId;
  },
  managerSchema () {
    return managerSchema;
  },
});

Template.addOrganizationManagerForm.events({
  'submit #organizationManagerForm': function (event) {
    // Prevent form from reloading page
    event.preventDefault();
  },
});
