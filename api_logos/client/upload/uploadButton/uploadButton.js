import { ApiLogos } from '../../../collection';

Template.uploadApiLogoButton.onRendered(function() {
  // Assign resumable browse to element
  ApiLogos.resumable.assignBrowse($('.fileBrowse'));
});
