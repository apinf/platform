import { Template } from 'meteor/templating';
import managerSchema from './schema';

Template.addOrganizationManagerForm.helpers({
  managerSchema () {
    return managerSchema;
  },
});
