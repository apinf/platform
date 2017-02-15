// Collection imports
import OrganizationLogo from '/organizations/logo/collection/collection';

Template.uploadOrganizationLogoButton.onRendered(() => {
  // Assign resumable browse to element
  OrganizationLogo.resumable.assignBrowse($('.fileBrowse'));
});
