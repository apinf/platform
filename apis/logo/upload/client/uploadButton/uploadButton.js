import { ApiLogo } from '/apis/logo/collection/collection';

Template.uploadApiLogoButton.onRendered(function() {
  // Assign resumable browse to element
  ApiLogo.resumable.assignBrowse($('.fileBrowse'));
});
