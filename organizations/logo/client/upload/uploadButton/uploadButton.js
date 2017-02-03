import { Template } from 'meteor/templating';
import OrganizationLogo from '/organizations/logo/collection/collection';
import $ from 'jquery';

Template.uploadOrganizationLogoButton.onRendered(() => {
  // Assign resumable browse to element
  OrganizationLogo.resumable.assignBrowse($('.fileBrowse'));
});
