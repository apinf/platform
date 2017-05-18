/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Collection imports
import Apis from '/apis/collection';
import ApiV1 from '/core/server/api';
import Organizations from '/organizations/collection';

// Request /rest/v1/apis for Apis collection
ApiV1.addCollection(Apis, {
  routeOptions: {
    authRequired: false,
  },
  endpoints: {
    // Return a list of all public entities within the collection
    getAll: {
      swagger: {
        tags: [
          ApiV1.swagger.tags.api,
        ],
        description: 'List and search public APIs.',
        parameters: [
          ApiV1.swagger.params.optionalSearch,
          ApiV1.swagger.params.organizationApi,
          ApiV1.swagger.params.skip,
          ApiV1.swagger.params.limit,
          ApiV1.swagger.params.lifecycle,
        ],
        responses: {
          200: {
            description: 'Returns list of public APIs',
          },
          400: {
            description: 'Bad query parameters',
          },
        },
      },
      action () {
        const queryParams = this.queryParams;

        // Only Public APIs are available for unregistered user
        const query = { isPublic: true };
        const options = {};

        // Parse query parameters
        if (queryParams.organizationApi) {
          // Get organization document with specified ID
          const organization = Organizations.findOne(queryParams.organizationApi);

          // Make sure Organization exists
          if (organization) {
            // Get list of managed API IDs
            query._id = { $in: organization.managedApiIds() };
          }
        }

        if (queryParams.lifecycle) {
          query.lifecycleStatus = queryParams.lifecycle;
        }

        if (queryParams.limit) {
          options.limit = parseInt(queryParams.limit, 10);
        }

        if (queryParams.skip) {
          options.skip = parseInt(queryParams.skip, 10);
        }

        // Pass an optional search string for looking up inventory.
        if (queryParams.q) {
          query.$or = [
            {
              name: {
                $regex: queryParams.q,
                $options: 'i', // case-insensitive option
              },
            },
            {
              description: {
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
            data: Apis.find(query, options).fetch(),
          },
        };
      },
    },
    // Return the entity with the given :id
    get: {
      authRequired: false,
      swagger: {
        tags: [
          ApiV1.swagger.tags.api,
        ],
        description: 'Returns one API with specified ID or nothing if there is not match found',
        parameters: [
          ApiV1.swagger.params.apiId,
        ],
        responses: {
          200: {
            description: 'Returns API',
          },
          404: {
            description: 'Bad parameter',
          },
        },
      },
    },
    post: {
      authRequired: true,
      swagger: {
        tags: [
          ApiV1.swagger.tags.api,
        ],
        description: 'Adds an API to catalog. On success, returns newly added API object.',
        parameters: [
          ApiV1.swagger.params.api,
        ],
        responses: {
          200: {
            description: 'API successfully added',
          },
          401: {
            description: 'Authentication is required',
          },
        },
        security: [
          {
            userSecurityToken: [],
            userId: [],
          },
        ],
      },
    },
    // Modify the entity with the given :id with the data contained in the request body.
    put: {
      authRequired: true,
      // manager role is required. If a user already has an API then the user has manager role
      roleRequired: ['manager', 'admin'],
      swagger: {
        tags: [
          ApiV1.swagger.tags.api,
        ],
        description: 'Update an API',
        parameters: [
          ApiV1.swagger.params.apiId,
          ApiV1.swagger.params.api,
        ],
        responses: {
          200: {
            description: 'API successfully edited.',
          },
          401: {
            description: 'Authentication is required',
          },
          403: {
            description: 'User does not have permission',
          },
          404: {
            description: 'API is not found',
          },
        },
        security: [
          {
            userSecurityToken: [],
            userId: [],
          },
        ],
      },
      action () {
        // Get data from body parameters
        const bodyParams = this.bodyParams;
        // Get ID of API
        const apiId = this.urlParams.id;
        const userId = this.userId;
        const api = Apis.findOne(apiId);

        // Make sure API exists & user can manage
        if (api && api.managerIds.includes(userId)) {
          // Update API document
          Apis.update(apiId, { $set: bodyParams });

          return {
            statusCode: 200,
            body: {
              status: 'Success updating',
              data: Apis.findOne(apiId),
            },
          };
        }

        // Make sure API exists but user can not manage
        if (api && api.managerIds.indexOf(userId) === -1) {
          return {
            statusCode: 403,
            body: {
              status: 'Fail',
              message: 'You do not have permission for editing this API',
            },
          };
        }

        // API doesn't exist
        return {
          statusCode: 404,
          body: {
            status: 'Fail',
            message: 'API is not found with specified ID',
          },
        };
      },
    },
    delete: {
      authRequired: true,
      // manager role is required. If a user already has an API then the user has manager role
      roleRequired: ['manager', 'admin'],
      swagger: {
        tags: [
          ApiV1.swagger.tags.api,
        ],
        description: 'Deletes the identified API from the system.',
        parameters: [
          ApiV1.swagger.params.apiId,
        ],
        responses: {
          200: {
            description: 'API successfully removed.',
          },
          401: {
            description: 'Authentication is required',
          },
          403: {
            description: 'User does not have permission',
          },
          404: {
            description: 'API is not found',
          },
        },
        security: [
          {
            userSecurityToken: [],
            userId: [],
          },
        ],
      },
      action () {
        // Get ID of API
        const apiId = this.urlParams.id;
        // Get User ID
        const userId = this.userId;
        // Get API document
        const api = Apis.findOne(apiId);

        // Make sure API exists & user can manage
        if (api && api.managerIds.includes(userId)) {
          // Remove API document
          Meteor.call('removeApi', api._id);

          return {
            statusCode: 200,
            body: {
              status: 'Api successfully removed',
              data: Apis.findOne(apiId),
            },
          };
        }

        // Make sure API exists but user can not manage
        if (api && api.managerIds.indexOf(userId) === -1) {
          return {
            statusCode: 403,
            body: {
              status: 'Fail',
              message: 'You do not have permission for removing this API',
            },
          };
        }

        // API doesn't exist
        return {
          statusCode: 404,
          body: {
            status: 'Fail',
            message: 'API is not found with specified ID',
          },
        };
      },
    },
  },
});
