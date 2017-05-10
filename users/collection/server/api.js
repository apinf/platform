/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Collection imports
import ApiV1 from '/core/server/api';

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
          responses: {
            200: {
              description: 'users',
            },
          },
        },
        action () {
          // Init response object
          let response = {};
          // Get queryParams i.e. /users?username=something
          const queryParams = this.queryParams;
          // Handle query params
          if (queryParams && !_.isEmpty(queryParams)) {
            // Check queryParams for username
            if (queryParams.username) {
              // Fetch only APIs with given username
              const findByUsername = Meteor.users.find(
                { username: queryParams.username }
              ).fetch();
              // Construct response
              response = {
                statusCode: 200,
                body: {
                  status: 'success',
                  data: findByUsername,
                },
              };
            } else {
              // Error: bad query params
              response = {
                statusCode: 400,
                body: {
                  status: 'fail',
                  message: 'Bad query parameters',
                },
              };
            }
          } else {
          // Construct response
            response = {
              statusCode: 200,
              body: {
                status: 'success',
                data: Meteor.users.find().fetch(),
              },
            };
          }
          // Return constructed response
          return response;
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
