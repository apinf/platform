/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11
 */

// Meteor packages imports
import { Template } from 'meteor/templating';

Template.apiCatalogTable.onCreated(function () {
  this.autorun(() => {
    // Get APIs document
    const apis = Template.currentData().apis;

    const apiLogoIds = [];

    // Get list of logo IDs
    apis.forEach((api) => {
      if (api.apiLogoFileId) {
        apiLogoIds.push(api.apiLogoFileId);
      }
    });

    // Subscribe to API logo collection by logo IDs
    this.subscribe('apiLogoByIds', apiLogoIds);

    // Subscribe to usernames of API managers
    this.subscribe('managersUsernames', apis);
  });
});
