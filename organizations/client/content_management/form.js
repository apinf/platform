// Meteor packages imports
import { Template } from 'meteor/templating';

// Collection imports
import Organizations from '../../collection/';

Template.numberOfMediasPerPageForm.helpers({
  organizationsCollection () {
    // Make Organizations collection available to template (i.e. autoform)
    return Organizations;
  },
  select () {
    const instance = Template.instance();
    console.log('instance', instance.data);
  },
});
