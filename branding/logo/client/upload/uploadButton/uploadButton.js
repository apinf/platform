// Meteor packages imports
import { Template } from 'meteor/templating';

// Collection imports
import ProjectLogo from '/branding/logo/collection';

Template.uploadProjectLogoButton.onRendered(() => {
  // Assign resumable browse to element
  ProjectLogo.resumable.assignBrowse($('.fileBrowse'));
});
