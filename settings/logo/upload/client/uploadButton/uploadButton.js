import { ProjectLogo } from '/settings/logo/collection';

Template.uploadProjectLogoButton.onRendered(function() {
  // Assign resumable browse to element
  ProjectLogo.resumable.assignBrowse($('.fileBrowse'));
});
