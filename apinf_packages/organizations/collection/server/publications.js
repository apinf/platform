/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// Meteor contributed packages imports
import { Counts } from 'meteor/tmeasday:publish-counts';

// Npm packages imports
import _ from 'lodash';

// Collection imports
import OrganizationApis from '/apinf_packages/organization_apis/collection';
import Apis from '/apinf_packages/apis/collection';
import Organizations from '../';

Meteor.publish('allOrganizationBasicDetails', () => {
  return Organizations.find({}, {
    fields: {
      _id: 1,
      name: 1,
      description: 1,
      contact: 1,
    },
  });
});

// Publish collection for pagination
// TODO: Determine if there is a better way to handle pagination
// eslint-disable-next-line no-new
new Meteor.Pagination(Organizations, {
  transform_options: (filters, options) => {
    return _.merge({ fields: Organizations.publicFields }, options);
  },
});

Meteor.publish('userManagedOrganizations', function () {
  return Organizations.find({ managerIds: this.userId });
});

Meteor.publish('organizationApisCount', function (organizationId) {
  // Make sure 'organizationId' is a String
  check(organizationId, String);

  // Get current user Id
  const userId = this.userId;

  // Get the organization information
  const organization = Organizations.findOne({ _id: organizationId });

  // Checks if user can manage apis of organization
  const userCanViewPrivateApis = userId && organization.currentUserCanManage(userId);

  // Publish count of organization apis
  let organizationApisCount = OrganizationApis.find({ organizationId });

  // Get only the publics APIs or this organization
  if (!userCanViewPrivateApis) {
    // Ids of publics APIs
    const apisSelector = [];

    // Iterates over api organizations to get the publics apis
    organizationApisCount.forEach((organizationApi) => {
      // Get API information
      const api = Apis.findOne({ _id: organizationApi.apiId });

      // Checks if the user is manager of this API
      if (api.isPublic || (userId && api.currentUserCanManage(userId))) {
        apisSelector.push({ apiId: api._id });
      }
    });

    // Uses the apisSelector to get get only publics APIs
    organizationApisCount = OrganizationApis.find({ $or: apisSelector });
  }

  // Publish an Api Counter for each Organization
  Counts.publish(this, `organizationApisCount-${organizationId}`, organizationApisCount);
});

Meteor.publishComposite('organizationComposite', (slug) => {
  // Returning an organization with managers
  // TODO: Move all organization related publicationd as children
  check(slug, String);
  return {
    find () {
      return Organizations.find({ slug });
    },
    children: [
      {
        find (organization) {
          return Meteor.users.find(
            { _id: { $in: organization.managerIds } },
            { fields: { username: 1, emails: 1, _id: 1 } });
        },
      },
    ],
  };
});
