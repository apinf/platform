/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Collection imports
import ApiV1 from '/core/server/api';
// Meteor packages imports
import { Meteor } from 'meteor/meteor';
// Enable user endpoints if authentication is enabled
// eslint-disable-next-line no-underscore-dangle
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
