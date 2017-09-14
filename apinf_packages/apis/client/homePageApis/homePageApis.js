/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Collection imports
import Apis from '/apinf_packages/apis/collection';
import Branding from '/apinf_packages/branding/collection';

Template.homePageApis.onRendered(function () {
  // Reference to Template instance
  const templateInstance = this;
  templateInstance.autorun(() => {
    templateInstance.branding = Branding.findOne();
    // check featured apis available or not
    const haveFeaturedApis = templateInstance.branding.featuredApis &&
      templateInstance.branding.featuredApis.length !== 0;
    if (haveFeaturedApis) {
      templateInstance.subscribe('apiIds', templateInstance.branding.featuredApis);
    }
  });
});

Template.homePageApis.helpers({
  homePageApis () {
    const templateInstance = Template.instance();
    const branding = templateInstance.branding;
    // Check whether any APIs have been featured
    const haveFeaturedApis = branding && 
      branding.featuredApis && 
      branding.featuredApis.length !== 0;
    if (haveFeaturedApis) {
      // Fetch featured apis from all apis
      const featuredApis = Apis.find().fetch();
      return featuredApis;
    }
    return false;
  },
});
