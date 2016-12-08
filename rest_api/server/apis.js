import { Apis } from '/apis/collection';
import { ApiV1 } from './config';

// Simple collection route for Apis
ApiV1.addCollection(Apis, {
  excludedEndpoints: ['post', 'put', 'delete'],
  routeOptions: { authRequired: false },
  endpoints: {
    getAll: {
      swagger: {
        description: 'Returns all APIs.',
        responses: {
          200: {
            description: 'List of organizations.',
          },
        },
      },
    },
    get: {
      swagger: {
        description: 'Returns one API with given ID.',
        responses: {
          200: {
            description: 'One API.',
          },
        },
      },
    },
  },
});
