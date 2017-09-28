/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Collection imports
import Branding from '/apinf_packages/branding/collection';
import Apis from '/apinf_packages/apis/collection';

// Meteor contributed packages imports
import { TAPi18n } from 'meteor/tap:i18n';
import 'select2';
import 'select2/dist/css/select2.css';
import 'select2-bootstrap-theme/dist/select2-bootstrap.css';

Template.branding.onCreated(function () {
  // Get reference to template instance
  const templateInstance = this;
  templateInstance.autorun(() => {
    templateInstance.subscribe('apisForBranding');
    // Get all api relevant data for option
    templateInstance.options = Apis.find().map((api) => {
      return {
        text: api.name,
        id: api._id,
      };
    });
  })
});

Template.branding.onRendered(function () {
  $('[data-toggle="popover"]').popover();
  const message = TAPi18n.__('branding_projectFeaturedApisMessage_featuredApiMessage');
  setTimeout(() => {
    const options = this.options;
    $('[name=featuredApis]').select2({
      placeholder: message,
      tags: true,
      tokenSeparators: [',', ' '],
      data: options,
    });
  }, 800);
});

Template.branding.helpers({
  branding () {
    // Get Branding collection content
    return Branding.findOne();
  },
  brandingCollection () {
    return Branding;
  },
  s2Opts () {
    const message = TAPi18n.__('branding_projectFeaturedApisMessage_featuredApiMessage');
    const options = {
      placeholder: message,
      tags: true,
    };
    return options;
  },
  optionsAPi () {
    return Apis.find().map((api) => {
      return {
        label: api.name,
        value: api._id,
      };
    });
  },
});
