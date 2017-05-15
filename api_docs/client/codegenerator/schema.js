/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor contributed packages imports
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { TAPi18n } from 'meteor/tap:i18n';

// APInf specific imports
import codeGeneratorLanguageOptions from './codeGeneratorLanguageOptions';

export default codeGeneratorSchema = new SimpleSchema({
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
  codegenServer: {
    type: String,
  },
  callRequest: {
    type: String,
  },
  documentationFileURL: {
    type: String,
  },
  urlParameters: {
    type: String,
  },
});
