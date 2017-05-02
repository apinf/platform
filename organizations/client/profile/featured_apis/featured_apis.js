/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
// import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
// import { FlowRouter } from 'meteor/kadira:flow-router';
// import { TAPi18n } from 'meteor/tap:i18n';

// Collection imports
import Apis from '/apis/collection';

Template.organizationFeaturedApis.helpers({
  apis () {
    const featuredApiList = Template.currentData().organization.featuredApiIds;

    const apis = Apis.find({
      _id: { $in: featuredApiList },
    }).fetch();

    return apis;
  },
  featuredApisCount () {
    const featuredApiList = Template.currentData().organization.featuredApiIds;

    const apis = Apis.find({
      _id: { $in: featuredApiList },
    }).fetch();

    return apis.length;
  },
  hasFeaturedApi () {
    const featuredApiList = Template.currentData().organization.featuredApiIds;

    const apis = Apis.find({
      _id: { $in: featuredApiList },
    }).fetch();

    return apis.length;
  },
});
