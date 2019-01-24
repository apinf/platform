/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Random } from 'meteor/random';
import { Email } from 'meteor/email';

// Meteor contributed packages imports
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';

// Npm packages imports
import _ from 'lodash';

// Collection imports
import Apis from '/apinf_packages/apis/collection';
import OrganizationApis from '/apinf_packages/organization_apis/collection';
import Organizations from '/apinf_packages/organizations/collection';
import Settings from '/apinf_packages/settings/collection';

// APInf imports
import {
  mailSettingsValid,
} from '/apinf_packages/core/helper_functions/validate_settings';

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
  addOrganizationManager (manager) {
    check(manager, Object);

    // Get any user with matching email
    const userByEmail = Accounts.findUserByEmail(manager.user);
    // Get any user with matching username
    const userByUsername = Accounts.findUserByUsername(manager.user);

    // "User" field can be e-mail value or username value
    const user = userByEmail || userByUsername; 

    // No matching in both direction
    if (!user) {
      throw new Meteor.Error('user-not-registered');
    }

    // Get organization document
    const organization = Organizations.findOne(manager.organizationId);

    // Check if user is already a manager
    const alreadyManager = organization.managerIds.includes(user._id);
    // Check if the user is already a manager
    if (alreadyManager) {
      throw new Meteor.Error('manager-already-exist');
    } else {
      // Construct object and assign manager ID
      const emailVerification = {
        managerIds: user._id,
      };
      // Ignore organization creator
      if (organization.createdBy === user._id) {
        // Assign default value for creator of organization
        emailVerification.verified = true;
        emailVerification.verificationToken = '';
      } else {
        // Send email verification code
        const response = Meteor.call('sendEmailVerification', user._id, organization.slug);

        // Check error status
        if (response.status === 'failed') {
          // Check error type
          if (response.message === 'email-failed') {
            throw new Meteor.Error('email-failed');
          } else if (response.message === 'mail-setting-invalid') {
            throw new Meteor.Error('email-failed-mail-setting-invalid');
          }
        }

        // Assign response token and verified value
        emailVerification.verified = false;
        emailVerification.verificationToken = response.token;
      }

      // Add user ID to manager IDs field
      const result = Organizations.update(manager.organizationId,
        { $push: { managerIds: user._id, emailVerification } });

      if (!result) {
        throw new Meteor.Error('add-manager-fail');
      }
    }

    // Add user ID to manager IDs field
    Organizations.update(manager.organizationId, { $push: { managerIds: user._id } });
  },
  removeOrganizationManager (organizationId, userId) {
    // Make sure organizationId is an String
    check(organizationId, String);

    // Make sure userId is an String
    check(userId, String);

    // Remove User ID from managers array
    const result = Organizations.update({ _id: organizationId }, {
      $pull: {
        managerIds: userId,
        emailVerification: {
          managerIds: userId,
        },
      },
    });

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

    // Get formed slug
    const slugFormed = Meteor.call('formSlugFromName', 'Organizations', organization.name);

    // If formed slug true
    if (slugFormed && typeof slugFormed === 'object') {
      // Update new slug
      Organizations.update({ name: organization.name }, {
        $set: {
          slug: slugFormed.slug,
          'friendlySlugs.slug.base': slugFormed.friendlySlugs.slug.base,
          'friendlySlugs.slug.index': slugFormed.friendlySlugs.slug.index,
        },
      });

      // Return the organization slug
      return slugFormed.slug;
    }

    // Return
    return slugFormed;
  },
  sendEmailVerification (managerId, slug) {
    // Make sure managerId is a String
    check(managerId, String);
    // Make sure slug is a String
    check(slug, String);

    // Get Settings collection
    const settings = Settings.findOne();
    let token = '';
    // Check if mail settings are provided
    if (mailSettingsValid(settings)) {
      const username = encodeURIComponent(settings.mail.username);
      const password = encodeURIComponent(settings.mail.password);
      const smtpHost = encodeURIComponent(settings.mail.smtpHost);
      const smtpPort = encodeURIComponent(settings.mail.smtpPort);

      // Set MAIL_URL env variable
      // Note, this must be on one, long line for the URL to be valid
      process.env.MAIL_URL = `smtp://${username}:${password}@${smtpHost}:${smtpPort}`;
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

      // Get User collection
      const user = Meteor.users.findOne(managerId);
      const sendEmailTo = user.emails[0].address;

      // Create token
      token = Random.secret();

      // Get hostname
      const hostname = Meteor.absoluteUrl();
      const url = `${hostname}email-verify/${token}/${slug}`;

      const message = `<p>To verify your email address visit the following link:</p>\n
      <p><a href=${url}>${url}</a></p>`;

      // try catch here
      try {
        // Send the e-mail
        Email.send({
          to: sendEmailTo,
          from: settings.mail.fromEmail,
          subject: 'Verify Your Email Address',
          html: message,
        });
      } catch (e) {
        return {
          status: 'failed',
          message: 'email-failed',
        };
      }
    } else {
      return {
        status: 'failed',
        message: 'mail-setting-invalid',
      };
    }

    return {
      token,
      status: 'success',
      message: 'email-send-successfully',
    };
  },
  verifyToken (verificationToken) {
    // Make sure verificationToken is a String
    check(verificationToken, String);

    // Get organization document
    const organization = Organizations.findOne(
      { 'emailVerification.verificationToken': verificationToken });

    // Check organization
    if (!organization) {
      // Throw token error for client
      throw new Meteor.Error('Verification failed. Authentication token does not exist in db.');
    }

    const resp = Organizations.update(
      { 'emailVerification.verificationToken': verificationToken },
      { $set: {
        'emailVerification.$.verified': true,
      },
      });

    return resp;
  },
});
