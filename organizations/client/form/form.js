// Meteor packages imports
import { Template } from 'meteor/templating';

// Collection imports
import Organizations from '../../collection/';

Template.organizationForm.helpers({
  organizationsCollection () {
    // Make Organizations collection available to template (i.e. autoform)
    return Organizations;
  },
});
