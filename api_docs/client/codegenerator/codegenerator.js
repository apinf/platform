/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// APINF imports
import codeGeneratorSchema from './schema';

Template.sdkCodeGeneratorModal.helpers({
  // Schema for SDK Code Generator form
  codeGeneratorSchema () {
    // Create simple schema for sdk modal
    return codeGeneratorSchema;
  },
});
