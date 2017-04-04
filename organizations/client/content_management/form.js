// Meteor packages imports
import { Template } from 'meteor/templating';

// Collection imports
import Organizations from '../../collection/';

Template.numberOfMediasPerPageForm.helpers({
  organizationsCollection () {
    // Make Organizations collection available to template (i.e. autoform)
    return Organizations;
  },
});
Template.numberOfMediasPerPageForm.events({
  'click #selectedvalue': function (event) {
    const selectedvalue = $(event.currentTarget).val();
    const organizationId = Template.instance().data.organization._id;
    Organizations.update({
      _id: organizationId },
      { $set: { numberOfMediasPerPage: selectedvalue },
      });
    // return 'update';
  },
});
