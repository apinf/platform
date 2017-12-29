/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { TAPi18n } from 'meteor/tap:i18n';

// APInf imports
import codeGeneratorLanguageOptions from './code_generator_language_options';

Template.sdkCodeGeneratorModal.helpers({
  // Schema for SDK Code Generator form
  codeGeneratorSchema () {
    // Create simple schema for sdk modal
    const codeGeneratorSchema = new SimpleSchema({
      selectLanguage: {
        label: TAPi18n.__('sdkCodeGeneratorModal_labelText_selectLanguage'),
        type: String,
        optional: false,
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

    return codeGeneratorSchema;
  },
});
