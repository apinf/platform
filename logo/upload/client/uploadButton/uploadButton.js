import { ProjectLogo } from '/logo/collection/collection';

Template.uploadProjectLogoButton.onRendered(function() {
  // Assign resumable browse to element
  ProjectLogo.resumable.assignBrowse($('.fileBrowse'));
});
