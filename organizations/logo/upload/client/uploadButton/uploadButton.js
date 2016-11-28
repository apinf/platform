import { Template } from 'meteor/templating';
import { OrganizationLogo } from '/organizations/logo/collection/collection';

Template.uploadOrganizationLogoButton.onRendered(function() {
  // Assign resumable browse to element
  OrganizationLogo.resumable.assignBrowse($('.fileBrowse'));
});
