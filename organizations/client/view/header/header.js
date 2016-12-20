import { Template } from 'meteor/templating';
import { OrganizationLogo } from '/organizations/logo/collection/collection';

Template.organizationProfileHeader.onRendered(function () {
  // Assign resumable browse to element
  OrganizationLogo.resumable.assignBrowse(this.$('#organization-file-browse'));
});
