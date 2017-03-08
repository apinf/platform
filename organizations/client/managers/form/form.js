// Meteor packages imports
import { Template } from 'meteor/templating';

// APINF imports
import managerSchema from './schema';

Template.addOrganizationManagerForm.helpers({
  managerSchema () {
    return managerSchema;
  },
});
