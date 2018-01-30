/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Node packages imports
import slugs from 'limax';

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// Meteor contributed packages imports
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';

// Npm packages imports
import _ from 'lodash';

// Collection imports
import Apis from '/apinf_packages/apis/collection';
import OrganizationApis from '/apinf_packages/organization_apis/collection';
import Organizations from '/apinf_packages/organizations/collection';

Meteor.methods({
  getCurrentUserUnlinkedApis () {
    // Get current User ID
    const userId = this.userId;

    // Find result for user with role
    if (userId) {
      // Find & group all connected apis
      const organizationApis = OrganizationApis.find().fetch();

      const linkedApis = _.map(organizationApis, (document) => {
        return document.apiId;
      });

      // Find apis that no equal connected
      const queryParams = {
        _id: { $nin: linkedApis },
      };

      // Check if user has admin role
      const userIsAdmin = Roles.userIsInRole(userId, ['admin']);

      // Is user not admin then
      if (!userIsAdmin) {
        // Limit selection for current user
        queryParams.managerIds = userId;
      }

      // Return sorted list of unlinked apis by name
      return Apis.find(queryParams, { sort: { name: 1 } }).fetch();
    }

    // Return undefined result for anonymous user
    return undefined;
  },
  addOrganizationManagerByEmail (manager) {
    // Make sure manager (with organizationId and email) is an Object
    check(manager, Object);

    // Subsequent checks for the expected object properties
    check(manager.organizationId, String);
    check(manager.email, String);

    // Check if email is registered
    const emailIsRegistered = Meteor.call('checkIfEmailIsRegistered', manager.email);

    if (emailIsRegistered) {
      // Get user with matching email
      const user = Accounts.findUserByEmail(manager.email);

      // Get organization document
      const organization = Organizations.findOne(manager.organizationId);

      // Check if user is already a manager
      const alreadyManager = organization.managerIds.includes(user._id);

      // Check if the user is already a manager
      if (alreadyManager) {
        throw new Meteor.Error('manager-already-exist');
      } else {
        // Add user ID to manager IDs field
        Organizations.update(manager.organizationId, { $push: { managerIds: user._id } });
      }
    } else {
      throw new Meteor.Error('email-not-registered');
    }
  },
  removeOrganizationManager (organizationId, userId) {
    // Make sure organizationId is an String
    check(organizationId, String);

    // Make sure userId is an String
    check(userId, String);

    // Remove User ID from managers array
    const result = Organizations.update({ _id: organizationId },
      { $pull:
         { managerIds: userId },
      }
     );

    return result;
  },
  removeUserFromAllOrganizations (userId) {
    // Make sure userId is an String
    check(userId, String);
    // Get list of Organizations where user is a manager
    const organizations = Organizations.find({
      managerIds: userId,
    }).fetch();

    // If user is a manager in any Organization
    if (organizations.length > 0) {
      // Loop through Users' Organizations
      organizations.forEach((organization) => {
        // Remove user from organization manager list
        Meteor.call('removeOrganizationManager', organization._id, userId);
      });
    }
  },
  removeApiFromFeaturedList (organizationId, apiId) {
    // Make sure organizationId is an String
    check(organizationId, String);

    // Make sure userId is an String
    check(apiId, String);

    // Remove API from featurd APIS list array
    Organizations.update({ _id: organizationId },
      { $pull:
         { featuredApiIds: apiId },
      }
     );
  },
  removeOrganization (organizationId) {
    check(organizationId, String);
    // Remove organization document
    const result = Organizations.remove(organizationId);

    // Make sure Organization removed
    if (result) {
      // Get all organizationApis links with current organization ID
      const organizationApis = OrganizationApis.find({ organizationId }).fetch();

      // Get array with all IDs of found document
      const organizationApisIDs = _.map(organizationApis, (link) => {
        return link._id;
      });

      // Remove organizationApi links
      OrganizationApis.remove({ _id: { $in: organizationApisIDs } });
    }

    return result;
  },
  getOrganizationProfile (slug) {
    // Make sure slug is a string
    check(slug, String);

    // Look for Organization
    const organization = Organizations.findOne({ slug });

    // Make sure Organization exists
    if (organization) {
      // Attach logo url
      organization.logoUrl = organization.logoUrl();
    }

    // Return organization
    return (organization);
  },
  userCanManageOrganization (userId, organization) {
    check(userId, String);
    check(organization, Object);

    // Check if user is admin
    const userIsAdmin = Roles.userIsInRole(userId, ['admin']);

    // Check if user is manager
    const userIsManager = organization.managerIds.includes(userId);

    return userIsAdmin || userIsManager;
  },
  updateOrganizationBySlug (query) {
    // Make sure query is a object
    check(query, Object);
    const organization = Organizations.findOne(query);

    if (!organization) {
      // Throw Organization error for client
      throw new Meteor.Error(`The Organization doesn't exist with parameter ${query}`);
    }
    const organizationName = organization.name;

    // Transliterates non-Latin scripts
    const slug = slugs(organizationName, { tone: false });

    // Look for existing duplicate slug beginning of the newest one
    const duplicateSlug = Organizations.findOne(
      {
        $or: [
          { 'friendlySlugs.slug.base': slug },
          { slug },
        ],
      },
      { sort: { 'friendlySlugs.slug.index': -1 } }
    );

    // Initialize index value 0
    let index = 0;
    let newSlug = slug;
    let slugBase = slug;

    // If duplicate slug exists
    if (duplicateSlug && duplicateSlug.friendlySlugs) {
      // Return existing slug if organization name exists
      if (organization._id === duplicateSlug._id
        && slug === duplicateSlug.friendlySlugs.slug.base) {
        return organization.slug;
      }
      // Set new index value
      index = duplicateSlug.friendlySlugs.slug.index + 1;

      // Get base slug value
      slugBase = duplicateSlug.friendlySlugs.slug.base;

      // Create new slug
      newSlug = `${slugBase}-${index}`;
    } else if (duplicateSlug && duplicateSlug.slug) {
      // Set new index value
      index += 1;

      // Create new slug
      newSlug = `${slugBase}-${index}`;
    }

    // Update new slug
    Organizations.update({ name: organizationName }, {
      $set: {
        slug: newSlug,
        'friendlySlugs.slug.base': slugBase,
        'friendlySlugs.slug.index': index,
      },
    });

    // Return the API slug
    return newSlug;
  },
});
