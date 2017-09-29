/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { TAPi18n } from 'meteor/tap:i18n';

// Collection imports
import Apis from '/apinf_packages/apis/collection';
import Branding from '/apinf_packages/branding/collection';

// Npm packages
import 'select2';
import 'select2/dist/css/select2.css';
import 'select2-bootstrap-theme/dist/select2-bootstrap.css';

Template.branding.onCreated(function () {
  // Get reference to template instance
  const templateInstance = this;

  // Get public APIs
  templateInstance.subscribe('apisForBranding');
});

Template.branding.onRendered(() => {
  $('[data-toggle="popover"]').popover();
});

Template.branding.helpers({
  branding () {
    // Get Branding collection content
    return Branding.findOne();
  },
  brandingCollection () {
    return Branding;
  },
  homepageApisSelect2Options () {
    // Get featuredApis or an empty array on default
    const featuredApis = Branding.findOne().featuredApis || [];
    // Message for placeholder
    const message = TAPi18n.__('branding_projectFeaturedApisMessage_featuredApiMessage');

    return {
      placeholder: message,
      // Data for select box
      data: Apis.find().map((api) => {
        return {
          text: api.name,
          id: api._id,
          // If featured APIs contains current one then mark it as "selected"
          selected: featuredApis.indexOf(api._id) > -1,
        };
      }),
    };
  },
});
