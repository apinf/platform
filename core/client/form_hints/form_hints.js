// Meteor packages imports
import { InlineHelp } from 'meteor/pahans:inline-help';
import { TAPi18n } from 'meteor/tap:i18n';

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
};

InlineHelp.initHelp(formHints);
