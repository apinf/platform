// Meteor packages imports
import { Restivus } from 'meteor/nimble:restivus';

const ApiV1 = new Restivus({
  apiPath: 'api',
  version: 'v1',
  defaultHeaders: {
    'Content-Type': 'application/json',
  },
  useDefaultAuth: true,
  prettyJson: true,
  enableCors: true,
});

// Add Restivus Swagger configuration
// - meta, tags, params, definitions
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
// eslint-disable-next-line no-underscore-dangle
if (ApiV1._config.useDefaultAuth) {
  // Generates: POST on /api/v1/users and GET, DELETE /api/v1/users/:id for
  // Meteor.users collection
  ApiV1.addCollection(Meteor.users, {
    excludedEndpoints: ['getAll', 'put'],
    routeOptions: {
      authRequired: true,
    },
    endpoints: {
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

// Generate Swagger to route /rest-api/v1/swagger.json
ApiV1.addSwagger('swagger.json');

export default ApiV1;
