import { Template } from 'meteor/templating';
import { managerSchema } from './schema';

Template.addOrganizationManagerForm.helpers({
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
