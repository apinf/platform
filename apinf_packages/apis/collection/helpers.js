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
import ss from 'simple-statistics';
import moment from 'moment';
import 'moment/min/locales.min';
import _ from 'lodash';

// Collection imports
import ApiBackendRatings from '/apinf_packages/ratings/collection';
import ApiBookmarks from '/apinf_packages/bookmarks/collection';
import DocumentationFiles from '/apinf_packages/api_docs/files/collection';
import ApiDocs from '/apinf_packages/api_docs/collection';
import ApiLogo from '/apinf_packages/apis/logo/collection';
import ApiBacklogItems from '/apinf_packages/backlog/collection';
import ApiMetadata from '/apinf_packages/metadata/collection';
import Apis from './';

Apis.helpers({
  currentUserCanManage (apiUserId) {
    // Get current userId
    // parameter apiUserId is used only in case of REST API
    const userId = apiUserId || Meteor.userId();
    // Check that user is logged in
    if (userId) {
      // Check if user is manager of this API
      const userIsManager = this.currentUserIsManager(apiUserId);

      // Check if user is administrator
      const userIsAdmin = Roles.userIsInRole(userId, ['admin']);

      // Get api organization
      const parentOrganization = this.organization();

      // Define api organization manager
      let userIsOrganizationManager;

      if (parentOrganization) {
        userIsOrganizationManager = parentOrganization.currentUserCanManage(userId);
      }

      // if user is manager or administrator, they can edit
      if (userIsManager || userIsOrganizationManager || userIsAdmin) {
        return true;
      }
    }
    // User is not logged in
    return false;
  },
  currentUserCanView () {
    // Get current userId
    const userId = Meteor.userId();

    // Check if user has external access
    const userIsAuthorized = _.includes(this.authorizedUserIds, userId);

    // Check if API is public
    // Only user who can edit, can view private APIs
    return (this.isPublic || userIsAuthorized || this.currentUserCanManage());
  },
  currentUserIsManager (apiUserId) {
    // Get current userId
    // parameter apiUserId is used only in case of REST API
    const userId = apiUserId || Meteor.userId();

    // Check if user is manager of this API
    const isManager = _.includes(this.managerIds, userId);

    return isManager;
  },
  getApiManagersByName () {
    // Get Manager IDs array from API Backend document
    const managerIds = this.managerIds;

    // Create API managers array with usernames
    const apiManagers = _.map(managerIds, (id) => {
      let userById;
      if (id) {
        userById = Meteor.users.findOne(id);
        if (userById && userById.username) {
          // Return username of manager
          return userById.username;
        }
      }
      // If array has null return admin
      return 'admin';
    });

    return apiManagers;
  },
  getAverageRating () {
    // Fetch all ratings
    const apiBackendRatings = ApiBackendRatings.find({
      apiBackendId: this._id,
    }).fetch();

    // If ratings exist
    if (apiBackendRatings) {
      // Create array containing only rating values
      // get only the rating value; omit User ID and API Backend ID fields
      const apiBackendRatingsArray = _.map(apiBackendRatings, rating => { return rating.rating; });

      // Get the average (mean) value for API Backend ratings
      const apiBackendRatingsAverage = ss.mean(apiBackendRatingsArray);
      // Return average with precision of 2 significant numbers
      const result = Number(apiBackendRatingsAverage.toPrecision(2));

      if (!isNaN(result)) {
        return Number(apiBackendRatingsAverage.toPrecision(2));
      }
    }

    return false;
  },
  getBookmarkCount () {
    // Get API Backend ID
    const apiBackendId = this._id;

    // Get count of API Bookmarks where API Backend ID is in API Backend IDs array
    const apiBookmarkCount = ApiBookmarks.find({ apiIds: apiBackendId }).count();

    return apiBookmarkCount || '0';
  },
  getRating () {
    // Get API Backend ID
    const apiBackendId = this._id;

    // Get current user ID
    const userId = Meteor.userId();

    // Check if user is logged in
    if (Meteor.userId()) {
      // Check if user has rated API Backend
      const userRating = ApiBackendRatings.findOne({
        apiBackendId,
        userId,
      });

      if (userRating) {
        return userRating.rating;
      }
    }

    // Otherwise, get average rating
    return this.averageRating;
  },
  entityType () {
    return 'api';
  },
  relativeUpdatedAt () {
    // Get current language
    const language = TAPi18n.getLanguage();
    // Return relative updated_at
    return moment(this.updated_at).locale(language).fromNow();
  },
  relativeCreatedAt () {
    // Get current language
    const language = TAPi18n.getLanguage();
    // Return relative updated_at
    return moment(this.created_at).locale(language).fromNow();
  },
  setAverageRating () {
    // get average rating value
    const averageRating = this.getAverageRating();

    // Check if average rating calculation succeeds
    if (averageRating) {
      // Update the API Backend with average rating value
      Apis.update(this._id, { $set: { averageRating } });
    }
  },
  setBookmarkCount () {
    // get average rating value
    const bookmarkCount = this.getBookmarkCount();

    // Check if average rating calculation succeeds
    if (bookmarkCount) {
      // Update the API Backend with average rating value
      Apis.update(this._id, { $set: { bookmarkCount } });
    } else {
      Apis.update(this._id, { $unset: { bookmarkCount: '' } });
    }
  },
  documentationUrl () {
    /*
    Return a URL to documentation file
    either from local collection or remote file
    */

    // Get API ID
    const apiId = this._id;

    const apiDocs = ApiDocs.findOne({ apiId });

    // Placeholder documentation Object
    let documentation;

    // Placeholder documentation file Object
    let documentationFile;

    // Check if apiDocs return something
    if (apiDocs) {
      // Get documentation method (URL of File)
      const documentationType = apiDocs.type;

      // Get uploaded documentation file ID
      const documentationFileId = apiDocs.fileId;

      if (documentationFileId) {
        // Convert to Mongo ObjectID
        const objectId = new Mongo.Collection.ObjectID(documentationFileId);

        // Get documentation file Object
        documentationFile = DocumentationFiles.findOne(objectId);
      }

      // Check if documentation file is available and method is File
      if (documentationFile && documentationType === 'file') {
        // Build documentation files base url
        const meteorAbsoluteUrl = Meteor.absoluteUrl().slice(0, -1);
        const documentationFilesBaseURL = meteorAbsoluteUrl + DocumentationFiles.baseURL;

        // Get documentation file URL
        documentation = `${documentationFilesBaseURL}/id/${documentationFileId}`;
      } else {
        // Get remote swagger file URL
        const documentationUrl = apiDocs.remoteFileUrl;

        if (documentationUrl && documentationType === 'url') {
          // Get documentation URL
          documentation = documentationUrl;
        }
      }
    }

    return documentation;
  },
  backlogIsNotEmpty () {
    // Get API id
    const apiId = this._id;

    const backlog = ApiBacklogItems.findOne({ apiBackendId: apiId });

    // Check if backlog exist
    if (backlog) {
      return true;
    }
    return false;
  },
  apiMetadataIsNotEmpty () {
    // Get API id
    const apiId = this._id;

    const apiMetadata = ApiMetadata.findOne({ apiId });

    // Check if Api Metadata exist
    if (apiMetadata) {
      return true;
    }
    return false;
  },
  logo () {
    // Placeholder logo Object
    let apiLogo;

    if (this.apiLogoFileId) {
      // Convert to Mongo ObjectID
      const objectId = new Mongo.Collection.ObjectID(this.apiLogoFileId);

      // Get API logo file Object
      apiLogo = ApiLogo.findOne(objectId);
    }
    return apiLogo;
  },
  logoUrl () {
    // Placeholder logo url
    let apiLogoUrl;

    // Get logo
    const apiLogo = this.logo();

    // Check if API logo file is available
    if (apiLogo) {
      // Get Meteor absolute URL
      const meteorAbsoluteUrl = Meteor.absoluteUrl().slice(0, -1);

      // Set base url
      const baseApiLogoURL = meteorAbsoluteUrl + ApiLogo.baseURL;

      // Get API logo file URL
      apiLogoUrl = `${baseApiLogoURL}/md5/${apiLogo.md5}`;
    }
    return apiLogoUrl;
  },
  apiDocsIsNotEmpty () {
    // Get API id
    const apiId = this._id;

    const apiDocs = ApiDocs.findOne({ apiId });

    // Check if API documentation exist
    if (apiDocs) {
      return true;
    }
    return false;
  },
});
