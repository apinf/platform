import { ProjectLogo } from '/branding/logo/collection';

Template.uploadProjectLogoButton.onRendered(function() {
  // Assign resumable browse to element
  ProjectLogo.resumable.assignBrowse($('.fileBrowse'));
});
