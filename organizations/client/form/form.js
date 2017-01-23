import { Template } from 'meteor/templating';
import Organizations from '../../collection/';

Template.organizationForm.helpers({
  organizationsCollection () {
    // Make Organizations collection available to template (i.e. autoform)
    return Organizations;
  },
});
