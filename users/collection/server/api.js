/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Collection imports
import ApiV1 from '/core/server/api';
import Organizations from '/organizations/collection';

// Npm packages imports
import _ from 'lodash';

// Enable user endpoints if authentication is enabled
if (ApiV1._config.useDefaultAuth) {
  // Generates: POST on /api/v1/users and GET, DELETE /api/v1/users/:id for
  // Meteor.users collection
  ApiV1.addCollection(Meteor.users, {
    excludedEndpoints: ['put'],
    routeOptions: {
      authRequired: true,
    },
    endpoints: {
      getAll: {
        swagger: {
          description: 'Returns users',
          parameters: [
            ApiV1.swagger.params.optionalSearch,
            ApiV1.swagger.params.organization_id,
            ApiV1.swagger.params.skip,
            ApiV1.swagger.params.limit,
            ApiV1.swagger.params.sort_by,
          ],
          responses: {
            200: {
              description: 'users',
            },
            400: {
              description: 'Bad query parameters',
            },
          },
        },
        action () {
          const queryParams = this.queryParams;

          const query = {};
          const options = {};
          // Handle query params
          if (queryParams && !_.isEmpty(queryParams)) {
            // parse query parameters
            if (queryParams.organization_id) {
              // Get organization document with specified ID
              const organization = Organizations.findOne(queryParams.organization_id);

              // Make sure Organization exists
              if (organization) {
                // Get list of managed API IDs
                query._id = { $in: organization.managerIds };
              }
            }

            if (queryParams.limit) {
              options.limit = parseInt(queryParams.limit, 10);
            }

            if (queryParams.skip) {
              options.skip = parseInt(queryParams.skip, 10);
            }

            if (queryParams.sort_by &&
                (queryParams.sort_by === 'username' ||
                 queryParams.sort_by === 'created_at' ||
                 queryParams.sort_by === 'updated_at' ||
                 queryParams.sort_by === 'organization'
                )
               ) {
              options.sortBy = queryParams.sort_by;
              options.sortDirection = 'ascending';
            }

            // Pass an optional search string for looking up inventory.
            if (queryParams.q) {
              query.$or = [
                {
                  username: {
                    $regex: queryParams.q,
                    $options: 'i', // case-insensitive option
                  },
                },
                {
                  'profile.company': {
                    $regex: queryParams.q,
                    $options: 'i', // case-insensitive option
                  },
                },
                {
                  'emails.address': {
                    $regex: queryParams.q,
                    $options: 'i', // case-insensitive option
                  },
                },
              ];
            }
            // Construct response
            return {
              statusCode: 200,
              body: {
                status: 'success',
                data: Meteor.users.find(query, options).fetch(),
              },
            };
          }
          // Construct response
          return {
            statusCode: 200,
            body: {
              status: 'success',
              data: Meteor.users.find().fetch(),
            },
          };
        },


      },
      get: {
        swagger: {
          description: 'Returns user with given ID.',
          responses: {
            200: {
              description: 'One user.',
            },
          },
        },
      },
      post: {
        authRequired: false,
        swagger: {
          description: 'Add user.',
          responses: {
            200: {
              description: 'Return user that was added.',
            },
          },
        },
      },
      delete: {
        roleRequired: 'admin',
        swagger: {
          description: 'Delete user.',
          responses: {
            200: {
              description: 'Successful delete.',
            },
          },
        },
      },
    },
  });
}
