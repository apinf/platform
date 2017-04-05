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
  'click .edit-num-page': function () {
    const selectedvalue = Template.instance().data.organization.numberOfMediasPerPage;
    const organizationId = Template.instance().data.organization._id;
    Organizations.update({
      _id: organizationId },
      { $set: { numberOfMediasPerPage: selectedvalue },
      });
  },
});
