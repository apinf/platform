import { Template } from 'meteor/templating';

import $ from 'jquery';

import ProjectLogo from '/branding/logo/collection';

Template.uploadProjectLogoButton.onRendered(() => {
  // Assign resumable browse to element
  ProjectLogo.resumable.assignBrowse($('.fileBrowse'));
});
