import { TAPi18n } from 'meteor/tap:i18n';
import { InlineHelp } from 'meteor/pahans:inline-help';


// Initialize help texts
const formHints = {
  documentation_link: {
    message: TAPi18n.__('manageApiDocumentationModal_hints_documentation_link'),
    options: {
      placement: 'left',
    },
  },
  uploadApiDocumentation: {
    message: TAPi18n.__('manageApiDocumentationModal_hints_uploadApiDocumentation'),
    options: {
      placement: 'left',
    },
  },
  documentation_editor_create_file: {
    message: TAPi18n.__('manageApiDocumentationModal_hints_createApiDocumentation'),
    options: {
      placement: 'left',
    },
  },
  settings_mail_fromEmail: {
    message: TAPi18n.__('settings_mail_fromEmail_hint'),
    options: {
      placement: 'left',
    },
  },
  settings_mail_toEmail: {
    message: TAPi18n.__('settings_mail_toEmail_hint'),
    options: {
      placement: 'left',
    },
  },
  apiSettings_visibility_authorizedUsers: {
    message: TAPi18n.__('apiSettings_visibility_authorizedUsers'),
    options: {
      placement: 'left',
    },
  },
};

InlineHelp.initHelp(formHints);
