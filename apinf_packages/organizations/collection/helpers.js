/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

// Meteor contributed packages imports
import { Roles } from 'meteor/alanning:roles';
import { TAPi18n } from 'meteor/tap:i18n';

// Npm packages imports
import moment from 'moment';
import 'moment/min/locales.min';
import _ from 'lodash';

// Collection imports
import OrganizationLogo from '/apinf_packages/organizations/logo/collection/collection';
import Apis from '/apinf_packages/apis/collection';
import Organizations from './';

Organizations.helpers({
  currentUserCanManage (apiUserId) {
    // Get current userId
    // parameter apiUserId is used only in case of REST API
    const userId = apiUserId || Meteor.userId();

    // Check that user is logged in
    if (userId) {
      // Check if user is manager of this organization
      const userIsManager = _.includes(this.managerIds, userId);

      // Check if user is administrator
      const userIsAdmin = Roles.userIsInRole(userId, ['admin']);

      // if user is manager or administrator, they can edit
      return userIsManager || userIsAdmin;
    }
    // User is not logged in
    return false;
  },
  relativeCreatedAt () {
    // Get current language
    const language = TAPi18n.getLanguage();
    // Convert createdAt time to format "time ago"
    return moment(this.createdAt).locale(language).fromNow();
  },
  entityType () {
    return 'organization';
  },
  logo () {
    // Placeholder logo Object
    let organizationLogo;

    if (this.organizationLogoFileId) {
      // Convert to Mongo ObjectID
      const objectId = new Mongo.Collection.ObjectID(this.organizationLogoFileId);

      // Get Organization logo file Object
      organizationLogo = OrganizationLogo.findOne(objectId);
    }
    return organizationLogo;
  },
  logoUrl () {
    // Set placeholder logo as default picture
    let organizationLogoUrl = '/img/placeholder-logo.jpg';

    // Get logo
    const organizationLogo = this.logo();

    // Check if Organization logo file is available
    if (organizationLogo) {
      // Get Meteor absolute URL
      const meteorAbsoluteUrl = Meteor.absoluteUrl().slice(0, -1);

      // Set base url
      const baseOrganizationLogoURL = meteorAbsoluteUrl + OrganizationLogo.baseURL;

      // Get Organization logo file URL
      organizationLogoUrl = `${baseOrganizationLogoURL}/md5/${organizationLogo.md5}`;
    }
    return organizationLogoUrl;
  },
  featuredApiListIsFull () {
    let featuredApiListIsFull = true;
    // Check if there is space in featured APIs list
    if (!this.featuredApiIds || this.featuredApiIds.length < 4) {
      featuredApiListIsFull = false;
    }
    return featuredApiListIsFull;
  },
  hasFeaturedApis () {
    if (this.featuredApis().length > 0) {
      return true;
    }
    return false;
  },
  featuredApis () {
    // Make sure organization has featured APIs
    if (this.featuredApiIds) {
      // Get APIs according to featured list
      const featuredApis = Apis.find({
        _id: { $in: this.featuredApiIds },
      }).fetch();

      return featuredApis;
    }
    return [];
  },
});
