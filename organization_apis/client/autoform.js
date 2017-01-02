import { AutoForm } from 'meteor/aldeed:autoform';
import { sAlert } from 'meteor/juliancwirko:s-alert';
import { TAPi18n } from 'meteor/tap:i18n';

AutoForm.hooks({
  organizationApisForm: {
    onError (formType, error) {
      // Catch method errors by error id
      // Show translated error message
      switch (error.error) {
        case 'organizationApis-insert-error': {
          const insertError = TAPi18n.__('organizationApis_insertError');
          sAlert.error(insertError);
          break;
        }
        case 'organizationApis-update-error': {
          const updateError = TAPi18n.__('organizationApis_updateError');
          sAlert.error(updateError);
          break;
        }
        default: {
          // Otherwise show unknown error
          const unknownError = TAPi18n.__('organizationApis_unknownError');
          sAlert.error(unknownError);
        }
      }
    },
    onSuccess () {
      // Create & show message on success
      const message = TAPi18n.__('organizationApisForm_successText');
      sAlert.success(message);
    },
  },
});
