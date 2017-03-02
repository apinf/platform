// Meteor packages imports
import { Template } from 'meteor/templating';

// Collection imports
import ApiLogo from '../../../collection';

Template.uploadApiLogoButton.onRendered(() => {
  // Assign resumable browse to element
  ApiLogo.resumable.assignBrowse($('.fileBrowse'));
});
