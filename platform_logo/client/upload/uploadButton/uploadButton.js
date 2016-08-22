import { ProjectLogo } from '/platform_logo/collection';

Template.uploadProjectLogoButton.onRendered(function() {
  // Assign resumable browse to element
  ProjectLogo.resumable.assignBrowse($('.fileBrowse'));
});
