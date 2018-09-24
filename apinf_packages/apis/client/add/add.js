/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { DocHead } from 'meteor/kadira:dochead';
import { TAPi18n } from 'meteor/tap:i18n';

// Collection imports
import Branding from '/apinf_packages/branding/collection';
import Apis from '../../collection';

Template.addApi.onRendered(() => {
  function checkForm() {
    // here, "this" is an input element
    var isValidForm = true;
    $('#addApiForm').find(':input[required]:visible').each(function() {
      if (!this.value.trim()) {
        isValidForm = false;
      }
    });
    $('#addApiForm').find('#submitapi-button').prop('disabled', !isValidForm);
    return isValidForm;
  }

  $('#submitapi-button').closest('form')
  // indirectly bind the handler to form
  .submit(function() {
    return checkForm.apply($(this).find(':input')[0]);
  })
  // look for input elements
  .find(':input[required]:visible')
  // bind the handler to input elements
  .keyup(checkForm)
  // immediately fire it to initialize buttons state
  .keyup();
});

Template.addApi.onCreated(function () {
  const instance = this;

  instance.autorun(() => {
    // Get Branding collection content
    const branding = Branding.findOne();
    // Check if Branding collection and siteTitle are available
    if (branding && branding.siteTitle) {
      // Set the page title
      const pageTitle = TAPi18n.__('addApiPage_title_addApi');
      DocHead.setTitle(`${branding.siteTitle} - ${pageTitle}`);
    }
  });
});

Template.addApi.helpers({
  ApisCollection () {
    // Make APIs collection available to template (i.e. autoform)
    return Apis;
  },
});
