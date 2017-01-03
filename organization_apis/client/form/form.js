import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';
import { OrganizationApis } from '../../collection';

Template.organizationApisForm.helpers({
  formtype () {
    // Placeholder for form type
    let formType;

    // Get reference to tempplate instance
    const instance = Template.instance();

    // Get Organization API document from template data context
    const organizationApi = instance.data.organizationApi;

    // If Organization API doc exists, type is update, otherwise type is insert
    if (organizationApi) {
      formType = 'update';
    } else {
      formType = 'insert';
    }

    return formType;
  },
  organizationApisCollection () {
    return OrganizationApis;
  },
});
