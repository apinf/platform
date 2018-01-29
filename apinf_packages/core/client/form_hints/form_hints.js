/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { InlineHelp } from 'meteor/pahans:inline-help';
import { TAPi18n } from 'meteor/tap:i18n';

// Initialize help texts
const formHints = {
  documentation_link: {
    message () {
      return TAPi18n.__('manageApiDocumentationModal_hints_documentation_link');
    },
    options: {
      placement: 'left',
    },
  },
  addApiDocumentation: {
    message () {
      return TAPi18n.__('manageApiDocumentationModal_hints_uploadApiDocumentation');
    },
    options: {
      placement: 'left',
    },
  },
};

InlineHelp.initHelp(formHints);
