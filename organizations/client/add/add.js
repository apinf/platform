import { Template } from 'meteor/templating';
import { Organizations } from '../../collection/';

Template.addOrganization.helpers({
  OrganizationsCollection () {
    // Make Organizations collection available to template (i.e. autoform)
    return Organizations;
  },
});
