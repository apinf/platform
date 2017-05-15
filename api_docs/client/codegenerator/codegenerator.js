/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { HTTP } from 'meteor/http';
import { ReactiveVar } from 'meteor/reactive-var';
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { TAPi18n } from 'meteor/tap:i18n';

// Npm packages imports
import _ from 'lodash';

// APINF imports
import codeGeneratorSchema from './schema';

Template.sdkCodeGeneratorModal.helpers({
  // Schema for SDK Code Generator form
  codeGeneratorSchema () {
    // Create simple schema for sdk modal
    return codeGeneratorSchema;
  },
  // From template AutoForm we don't have access to instance of this template
  // getTemplateInstance return object that containts the necessary varaibles
  getTemplateInstance () {
    // Get reference to template instance
    const instance = Template.instance();

    // Create object with instance varaibles
    return {
      codegenServer: instance.data.host,
      callRequest: instance.callRequest,
      documentationFileURL: instance.documentationFileURL,
      urlParameters: instance.urlParameters,
    };
  },
  buttonText () {
    // Return button text depending on language
    return TAPi18n.__('sdkCodeGeneratorModal_buttonText_download');
  },
});
