/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Meteor contributed packages imports
import { Restivus } from 'meteor/nimble:restivus';

const ApiV1 = new Restivus({
  apiPath: 'apinf-rest',
  version: 'v1',
  defaultHeaders: {
    'Content-Type': 'application/json',
  },
  useDefaultAuth: true,
  prettyJson: true,
  enableCors: true,
});

// Add Restivus Swagger configuration - meta, tags, params, definitions
ApiV1.swagger = {
  meta: {
    swagger: '2.0',
    info: {
      version: '1.0.0',
      title: 'Admin API',
    },
  },
  tags: {
    apis: 'Apis',
  },
  params: {
    apiId: {
      name: 'id',
      in: 'path',
      description: 'Api ID',
      required: true,
      type: 'string',
    },
  },
};

// Enable user endpoints if authentication is enabled
if (ApiV1._config.useDefaultAuth) {
  // Meteor.users collection
  ApiV1.addCollection(Meteor.users, {
    excludedEndpoints: ['getAll', 'put', 'patch'],
    routeOptions: {
      authRequired: true,
    },
    endpoints: {
      // GET /apinf-rest/v1/users/:id
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
      // POST /apinf-rest/v1/users/
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
      // DELETE /apinf-rest/v1/users/:id
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

// Generate Swagger to route /apinf-rest/v1/swagger.json
ApiV1.addSwagger('swagger.json');

export default ApiV1;
