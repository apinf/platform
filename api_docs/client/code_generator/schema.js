/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor contributed packages imports
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { TAPi18n } from 'meteor/tap:i18n';

// APINF imports
import codeGeneratorLanguageOptions from './code_generator_language_options';

const codeGeneratorSchema = new SimpleSchema({
  selectLanguage: {
    label: TAPi18n.__('sdkCodeGeneratorModal_labelText_selectLanguage'),
    type: String,
    autoform: {
      afFieldInput: {
        firstOption: TAPi18n.__('sdkCodeGeneratorModal_firstOption_language'),
      },
      options () {
        return codeGeneratorLanguageOptions;
      },
    },
  },
  host: {
    type: String,
    optional: false,
  },
  documentationFileURL: {
    type: String,
    optional: false,
  },
});

export default codeGeneratorSchema;
