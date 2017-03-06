// Npm packages imports
import _ from 'lodash';

// Collection imports
import Apis from '/apis/collection';
import ApiV1 from '/core/server/api';

// Generates: "GET all" /rest-api/v1/apis and "GET one"
// /rest-api/v1/apis/:id for Apis collection
ApiV1.addCollection(Apis, {
  excludedEndpoints: ['post', 'put', 'delete'],
  routeOptions: { authRequired: true },
  endpoints: {
    getAll: {
      swagger: {
        tags: [
          ApiV1.swagger.tags.apis,
        ],
        description: 'Returns all APIs.',
        responses: {
          200: {
            description: 'List of APIs.',
          },
          400: {
            description: 'Bad query parameters.',
          },
        },
      },
      action () {
        // Init response object
        let response = {};
        // Get queryParams
        const queryParams = this.queryParams;
        // Handle query params
        if (queryParams && !_.isEmpty(queryParams)) {
          // Check queryParams for organizationId
          if (queryParams.organizationId) {
            // Fetch only APIs with given organizationId
            const organizationApis = Apis.find(
              { organizationId: queryParams.organizationId }
            ).fetch();
            // Construct response
            response = {
              statusCode: 200,
              body: {
                status: 'success',
                data: organizationApis,
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
          // Otherwise get all apis
          const allApis = Apis.find().fetch();
          // Construct response
          response = {
            statusCode: 200,
            body: {
              status: 'success',
              data: allApis,
            },
          };
        }
        // Return constructed response
        return response;
      },
    },
    get: {
      swagger: {
        tags: [
          ApiV1.swagger.tags.apis,
        ],
        description: 'Returns one API with given ID.',
        parameters: [
          ApiV1.swagger.params.apiId,
        ],
        responses: {
          200: {
            description: 'One API.',
          },
        },
      },
    },
  },
});
