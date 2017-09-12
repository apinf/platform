/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// Npm packages imports
import _ from 'lodash';

// Collection imports
import ApiBacklogItems from '/apinf_packages/backlog/collection';
import ApiDocs from '/apinf_packages/api_docs/collection';
import Feedback from '/apinf_packages/feedback/collection';
import Organizations from '/apinf_packages/organizations/collection';
import OrganizationApis from '/apinf_packages/organization_apis/collection';
import ProxyBackends from '/apinf_packages/proxy_backends/collection';
import Apis from '../';

Meteor.publish('latestPublicApis', (limit) => {
  // Make sure limit is a Number
  check(limit, Number);

  // Return cursor to latest API Backends
  return Apis.find(
    { isPublic: true },
    { fields: Apis.publicFields, sort: { created_at: -1 }, limit }
  );
});

// Publish collection for pagination
// eslint-disable-next-line no-new
new Meteor.Pagination(Apis, {
  transform_options: (filters, options) => {
    return _.merge({ fields: Apis.publicFields }, options);
  },
});

// eslint-disable-next-line prefer-arrow-callback
Meteor.publishComposite('apiComposite', function (slug) {
  check(slug, String);
  return {
    find () {
      return Apis.find({ slug });
    },
    children: [
      {
        find (api) {
          // Get all managers username and email for current API and authorized user
          return Meteor.users.find({
            $or: [
              { _id: { $in: api.managerIds } },
              { _id: { $in: api.authorizedUserIds } },
            ],
          },
            { fields: { username: 1, emails: 1 } });
        },
      },
      {
        find (api) {
          // Get related API feedback items
          return Feedback.find({ apiBackendId: api._id });
        },
      },
      {
        find (api) {
          // Get related API Backlog items
          return ApiBacklogItems.find({ apiBackendId: api._id });
        },
      },
      {
        find (api) {
          // Get related proxy backend configuration
          return ProxyBackends.find({ apiId: api._id });
        },
      },
      {
        find (api) {
          // Get related documentation
          return ApiDocs.find({ apiId: api._id });
        },
      },
      {
        find (api) {
          // Get API organization
          const organization = api.organization();

          // Check if it has one
          if (organization) {
            // Get organization ID
            const organizationId = organization._id;

            // Return that organization
            return Organizations.find({ _id: organizationId });
          }

          return undefined;
        },
      },
      {
        find (api) {
          return OrganizationApis.find({ apiId: api._id });
        },
      },
    ],
  };
});
