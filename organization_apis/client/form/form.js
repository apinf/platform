// Collection imports
import OrganizationApis from '../../collection';

Template.organizationApisForm.helpers({
  formType () {
    // Get reference to tempplate instance
    const instance = Template.instance();

    // Get Organization API document from template data context
    const organizationApi = instance.data.organizationApi;

    // If Organization API doc exists, type is update, otherwise type is insert
    if (organizationApi) {
      return 'update';
    }

    return 'insert';
  },
  organizationApisCollection () {
    return OrganizationApis;
  },
});
