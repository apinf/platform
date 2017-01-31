import { Template } from 'meteor/templating';
import $ from 'jquery';

import ApiLogo from '../../../collection';


Template.uploadApiLogoButton.onRendered(() => {
  // Assign resumable browse to element
  ApiLogo.resumable.assignBrowse($('.fileBrowse'));
});
