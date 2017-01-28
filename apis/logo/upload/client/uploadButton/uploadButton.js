import ApiLogo from '../../../collection';

Template.uploadApiLogoButton.onRendered(function() {
  // Assign resumable browse to element
  ApiLogo.resumable.assignBrowse($('.fileBrowse'));
});
