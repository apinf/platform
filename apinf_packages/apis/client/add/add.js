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

// variables to check placeholder values from Add API fieldset
const apiNameFieldValue = 'e.g. Tampere Bus Service';
const apiDescriptionFieldValue = `e.g. Plan your journey across Tampere city with
           latest bus information, real-time vehicle location and inter zone routing.
           You can lookup bus times by line and stoppage.`; 
const apiUrlFieldValue = 'e.g. https://tampere-bus-service.fi';

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

Template.addApi.events({
  'click #api-name': function () {
    // on clicking field, placeholder value is removed.
    const field = document.getElementById('api-name');
    if (field.placeholder === apiNameFieldValue) {
      field.placeholder = '';
    }
  },
  'blur #api-name': function () {
    // If no field value is provided, placeholder value is restored on blur event
    const field = document.getElementById('api-name');
    if (field.placeholder === '') {
      field.placeholder = apiNameFieldValue;
    }
  },
  'click #api-description': function () {
    // on clicking field, placeholder value is removed.
    const field = document.getElementById('api-description');
    if (field.placeholder === apiDescriptionFieldValue) {
      field.placeholder = '';
    }
  },
  'blur #api-description': function () {
    // If no field value is provided, placeholder value is restored on blur event
    const field = document.getElementById('api-description');
    if (field.placeholder === '') {
      field.placeholder = apiDescriptionFieldValue;
    }
  },
  'click #api-url': function () {
    // on clicking field, placeholder value is removed.
    const field = document.getElementById('api-url');
    if (field.placeholder === apiUrlFieldValue) {
      field.placeholder = '';
    }
  },
  'blur #api-url': function () {
    // If no field value is provided, placeholder value is restored on blur event
    const field = document.getElementById('api-url');
    if (field.placeholder === '') {
      field.placeholder = apiUrlFieldValue;
    }
  },
});
