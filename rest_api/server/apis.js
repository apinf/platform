import { Apis } from '/apis/collection';
import { ApiV1 } from './config';

// Generates: "GET all" /rest-api/v1/apis and "GET one"
// /rest-api/v1/apis/:id for Apis collection
ApiV1.addCollection(Apis, {
  excludedEndpoints: ['post', 'put', 'delete'],
  routeOptions: { authRequired: false },
  endpoints: {
    getAll: {
      swagger: {
        description: 'Returns all APIs.',
        responses: {
          200: {
            description: 'List of APIs.',
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
