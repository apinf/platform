/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Meteor contributed packages imports
import { Roles } from 'meteor/alanning:roles';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

// Collection imports
import Apis from '/apinf_packages/apis/collection';
import ApiDocs from '/apinf_packages/api_docs/collection';
import ProxyBackends from '/apinf_packages/proxy_backends/collection';

// APInf imports
import CatalogV1 from '/apinf_packages/rest_apis/server/catalog';
import Organizations from '/apinf_packages/organizations/collection';
import Authentication from '/apinf_packages/rest_apis/server/authentication';
import descriptionApis from '/apinf_packages/rest_apis/lib/descriptions/apis_texts';
import errorMessagePayload from '/apinf_packages/rest_apis/server/rest_api_helpers';

CatalogV1.swagger.meta.paths = {
  '/login': Authentication.login,
  '/logout': Authentication.logout,
};

// Request /rest/v1/apis for Apis collection
CatalogV1.addCollection(Apis, {
  routeOptions: {
    authRequired: false,
  },
  endpoints: {
    // Response contains the entity with the given :id
    get: {
      authRequired: false,
      swagger: {
        tags: [
          CatalogV1.swagger.tags.api,
        ],
        summary: 'Fetch API with specified ID.',
        description: descriptionApis.get,
        parameters: [
          CatalogV1.swagger.params.apiId,
        ],
        responses: {
          200: {
            description: 'API found successfully',
            schema: {
              type: 'object',
              properties: {
                status: {
                  type: 'string',
                  example: 'success',
                },
                data: {
                  $ref: '#/definitions/apiResponse',
                },
              },
            },
          },
          204: {
            description: 'No data to return',
          },
          404: {
            description: 'API is not Found',
          },
        },
      },
      action () {
        const apiId = this.urlParams.id;

        // Fetch the API matching with condition
        const api = Apis.findOne({ _id: apiId });
        // Return error response, it API is not found.
        if (!api) {
          return errorMessagePayload(404, 'API with specified ID is not found.');
        }

        // Only Public APIs are available for non-admin/non-manager user
        if (api.isPublic === false) {
          let displayPrivateAPI = false;
          // Get requestor ID from header
          const requestorId = this.request.headers['x-user-id'];

          if (requestorId) {
            // Check if requestor is administrator
            const requestorIsAdmin = Roles.userIsInRole(requestorId, ['admin']);
            // Check if requestor is manager
            const requestorIsManager = api.currentUserCanManage(requestorId);
            displayPrivateAPI = requestorIsAdmin || requestorIsManager;
          }
          if (!displayPrivateAPI) {
            return {
              statusCode: 204,
              body: {
                status: 'success',
              },
            };
          }
        }

        // Extend API structure with correct link to API logo
        if (api.apiLogoFileId) {
          api.logoUrl = api.logoUrl();
        }

        // Instead of API URL, return API Proxy's URL, if it exists
        const proxyBackend = ProxyBackends.findOne({ apiId: api._id });

        // If Proxy is API Umbrella, fill in proxy URL
        if (proxyBackend && proxyBackend.type === 'apiUmbrella') {
          // Get connected proxy url
          const proxyUrl = proxyBackend.proxyUrl();
          // Get proxy backend path
          const frontendPrefix = proxyBackend.frontendPrefix();
          // Provide full proxy path
          api.url = proxyUrl.concat(frontendPrefix);
        }

        // Get URl of Swagger specification
        api.documentationUrl = api.documentationUrl();
        // Get URL to external site with API documentation
        api.externalDocumentation = api.otherUrl();

        // Construct response
        return {
          statusCode: 200,
          body: {
            status: 'success',
            data: api,
          },
        };
      },
    },
    // Create a new API
    post: {
      authRequired: true,
      swagger: {
        tags: [
          CatalogV1.swagger.tags.api,
        ],
        summary: 'Add new API to catalog.',
        description: descriptionApis.post,
        parameters: [
          CatalogV1.swagger.params.api,
        ],
        responses: {
          201: {
            description: 'API added successfully',
            schema: {
              type: 'object',
              properties: {
                status: {
                  type: 'string',
                  example: 'Success',
                },
                data: {
                  $ref: '#/definitions/apiResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request. Erroneous or missing parameter.',
          },
          401: {
            description: 'Authentication is required',
          },
          500: {
            description: 'Internal server error',
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
        const userId = this.userId;
        const bodyParams = this.bodyParams;

        // Include also user ID into DB
        bodyParams.created_by = userId;

        // structure for validating values against schema
        const validateFields = {
          name: bodyParams.name,
          url: bodyParams.url,
          description: bodyParams.description,
          lifecycleStatus: bodyParams.lifecycleStatus,
        };

        // Name is a required field
        if (!bodyParams.name) {
          return errorMessagePayload(400, 'Parameter "name" is mandatory.');
        }

        // Validate name
        let isValid = Apis.simpleSchema().namedContext().validateOne(
          validateFields, 'name');

        if (!isValid) {
          return errorMessagePayload(400, 'Parameter "name" is erroneous.');
        }

        // URL is a mandatory field
        if (!bodyParams.url) {
          return errorMessagePayload(400, 'Parameter "url" is mandatory.');
        }

        // Validate URL
        isValid = Apis.simpleSchema().namedContext().validateOne(
          validateFields, 'url');

        if (!isValid) {
          return errorMessagePayload(400, 'Parameter "url" must be a valid URL with http(s).');
        }

        // Check if API with same name already exists
        const duplicateApi = Apis.findOne({ name: bodyParams.name });

        if (duplicateApi) {
          const detailLine = 'Duplicate: API with same name exists.';
          const idValue = `${duplicateApi._id}`;
          return errorMessagePayload(400, detailLine, 'id', idValue);
        }

        // Description must not exceed field length in DB
        if (bodyParams.description) {
          isValid = Apis.simpleSchema().namedContext().validateOne(
            validateFields, 'description');

          if (!isValid) {
            return errorMessagePayload(400, 'Description length must not exceed 1000 characters.');
          }
        }

        // Is value of lifecycle status allowed
        if (bodyParams.lifecycleStatus) {
          isValid = Apis.simpleSchema().namedContext().validateOne(
            validateFields, 'lifecycleStatus');

          if (!isValid) {
            return errorMessagePayload(400, 'Parameter lifecycleStatus has erroneous value.');
          }
        }

        // Is the API set to public or private
        const isPublicParam = bodyParams.isPublic;

        if (isPublicParam) {
          if (isPublicParam === 'true') {
            bodyParams.isPublic = true;
          } else if (isPublicParam === 'false') {
            bodyParams.isPublic = false;
          } else {
            return errorMessagePayload(400, 'Parameter isPublic has erroneous value.');
          }
        }

        const documentationUrl = bodyParams.documentationUrl;
        const externalDocumentation = bodyParams.externalDocumentation;
        // Regex for http(s) protocol
        const regex = SimpleSchema.RegEx.Url;

        // Documentation URL must have URL format
        if (documentationUrl) {
          // Check link validity
          if (!regex.test(documentationUrl)) {
            // Error message
            const message = 'Parameter "documentationUrl" must be a valid URL with http(s).';
            return errorMessagePayload(400, message);
          }
        }

        // Link to an external site must have URL format
        if (externalDocumentation) {
          // Check link validity
          if (!regex.test(externalDocumentation)) {
            // Error message
            const message = 'Parameter "externalDocumentation" must be a valid URL with http(s).';
            return errorMessagePayload(400, message);
          }
        }

        // Add manager IDs list into
        const apiData = Object.assign({ managerIds: [userId] }, bodyParams);

        // Insert API data into collection
        const apiId = Apis.insert(apiData);

        // If insert failed, stop and send response
        if (!apiId) {
          return errorMessagePayload(500, 'Insert API card into database failed.');
        }

        // Add also documentation, if links are given
        if (documentationUrl || externalDocumentation) {
          const result = ApiDocs.insert({
            apiId,
            type: 'url',
            remoteFileUrl: documentationUrl,
            otherUrl: [externalDocumentation],
          });
          // Integrity: If insertion of document link failed, remove also API card
          if (result === 0) {
            // Remove newly created API document
            Meteor.call('removeApi', apiId);
            return errorMessagePayload(500, 'Insert documentation failed. API card not created.');
          }
        }

        // Prepare data to response, extend it with Documentation URLs
        const responseData = Object.assign(
          Apis.findOne(apiId),
          { documentationUrl, externalDocumentation });

        // Give user manager role
        Roles.addUsersToRoles(userId, 'manager');

        return {
          statusCode: 201,
          body: {
            status: 'success',
            data: responseData,
          },
        };
      },
    },
    // Modify the entity with the given :id with the data contained in the request body.
    put: {
      authRequired: true,
      // manager role is required. If a user already has an API then the user has manager role
      roleRequired: ['manager', 'admin'],
      swagger: {
        tags: [
          CatalogV1.swagger.tags.api,
        ],
        summary: 'Update API.',
        description: descriptionApis.put,
        parameters: [
          CatalogV1.swagger.params.apiId,
          CatalogV1.swagger.params.api,
        ],
        responses: {
          200: {
            description: 'API updated successfully',
            schema: {
              type: 'object',
              properties: {
                status: {
                  type: 'string',
                  example: 'Success',
                },
                data: {
                  $ref: '#/definitions/apiResponse',
                },
              },
            },
          },
          400: {
            description: 'Bad Request. Erroneous or missing parameter.',
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
        // Used in case of rollback
        let previousDocumentationUrl;

        // Get data from body parameters
        const bodyParams = this.bodyParams;
        // Get ID of API
        const apiId = this.urlParams.id;
        // Get current user ID
        const userId = this.userId;

        // Find API with specified ID
        const api = Apis.findOne(apiId);

        // API doesn't exist
        if (!api) {
          return errorMessagePayload(404, 'API with specified ID is not found.');
        }

        // API exists but user can not manage
        if (!api.currentUserCanManage(userId)) {
          return errorMessagePayload(403, 'You do not have permission for editing this API.');
        }

        // validate values
        const validateFields = {
          description: bodyParams.description,
          lifecycleStatus: bodyParams.lifecycleStatus,
        };

        // Description must not exceed field length in DB
        if (bodyParams.description) {
          const isValid = Apis.simpleSchema().namedContext().validateOne(
            validateFields, 'description');

          if (!isValid) {
            return errorMessagePayload(400, 'Description length must not exceed 1000 characters.');
          }
        }

        // Is value of lifecycle status allowed
        if (bodyParams.lifecycleStatus) {
          const isValid = Apis.simpleSchema().namedContext().validateOne(
            validateFields, 'lifecycleStatus');

          if (!isValid) {
            return errorMessagePayload(400, 'Parameter lifecycleStatus has erroneous value.');
          }
        }

        // Is the API set to public or private
        const isPublicParam = bodyParams.isPublic;

        if (isPublicParam) {
          if (isPublicParam === 'true') {
            bodyParams.isPublic = true;
          } else if (isPublicParam === 'false') {
            bodyParams.isPublic = false;
          } else {
            return errorMessagePayload(400, 'Parameter isPublic has erroneous value.');
          }
        }
        // Check if link for openAPI documentation was given
        const documentationUrl = bodyParams.documentationUrl;
        // Cehck if link for external documentation was given
        const externalDocumentation = bodyParams.externalDocumentation;

        if (documentationUrl || externalDocumentation) {
          // Try to fetch existing documentation
          const apiDoc = ApiDocs.findOne({ apiId });
          // Regex for http(s) protocol
          const regex = SimpleSchema.RegEx.Url;

          // Check link to Documentation URL
          if (documentationUrl) {
            // Check link validity
            if (!regex.test(documentationUrl)) {
              // Error message
              const message = 'Parameter "documentationUrl" must be a valid URL with http(s).';
              return errorMessagePayload(400, message);
            }
          }

          // Check link to an external documentation
          if (externalDocumentation) {
            // Check link validity
            if (!regex.test(externalDocumentation)) {
              // Error message
              const message = 'Parameter "externalDocumentation" must be a valid URL with http(s).';
              return errorMessagePayload(400, message);
            }

            // Check if new external documentation link can be added
            if (apiDoc && apiDoc.otherUrl) {
              // Can not add same link again
              const isLinkAlreadyPresent = apiDoc.otherUrl.includes(externalDocumentation);
              if (isLinkAlreadyPresent) {
                const message = 'Same link to "externalDocumentation" already exists.';
                return errorMessagePayload(400, message, 'url', externalDocumentation);
              }
              // Max 8 external documentation links can be added
              if (apiDoc.otherUrl.length > 7) {
                const message = 'Maximum number of external documentation links (8) already given.';
                return errorMessagePayload(400, message);
              }
            }
            // Prepare for rollback of openAPI documentation after possible failure
            if (apiDoc && apiDoc.remoteFileUrl) {
              previousDocumentationUrl = apiDoc.remoteFileUrl;
            }
          }

          // Update Documentation (or create a new one)
          const result = ApiDocs.update(
            { apiId },
            { $set: {
              type: 'url',
              remoteFileUrl: bodyParams.documentationUrl,
            },
              $push: { otherUrl: bodyParams.externalDocumentation } },
            // If apiDocs document did not exist, create a new one
            { upsert: true },
          );
          // If update/insert of document link(s) failed
          if (result === 0) {
            return errorMessagePayload(500, 'Update failed because Documentation update fail.');
          }
        }

        // Include user ID here so it can be filled to DB correspondingly
        // Note! Meteor.userId is not available!
        bodyParams.updated_by = userId;

        // Update API document
        const result = Apis.update(apiId, { $set: bodyParams });
        // Check if API update failed
        if (result === 0) {
          // Try to rollback documentation update, if necessary
          if (documentationUrl || externalDocumentation) {
            if (documentationUrl) {
              // Restore previous openAPI documentation link, if it exists
              if (previousDocumentationUrl) {
                ApiDocs.update(
                  { apiId },
                  { $set: {
                    type: 'url',
                    remoteFileUrl: previousDocumentationUrl,
                  },
                  },
              );
              } else {
                // No previous link, just make it empty
                ApiDocs.update(
                  { apiId },
                  { $unset: {
                    remoteFileUrl: '',
                  },
                  },
                );
              }
            }
            // Rollback external documentation by removing latest added link
            if (externalDocumentation) {
              ApiDocs.update(
                { apiId },
                { $set: {
                  type: 'url',
                },
                  $pull: { otherUrl: externalDocumentation } },
              );
            }
          }
          return errorMessagePayload(500, 'Update failed because API update fail.');
        }

        // Prepare data to response, extend it with Documentation URLs
        const responseData = Object.assign(
          // Get updated value of API
          Apis.findOne(apiId),
          // Get updated values of Documentation urls
          {
            externalDocumentation: api.otherUrl(),
            documentationUrl: api.documentationUrl(),
          });

        // OK response with API data
        return {
          statusCode: 200,
          body: {
            status: 'success',
            data: responseData,
          },
        };
      },
    },
    // Remove an API
    delete: {
      authRequired: true,
      // manager role is required. If a user already has an API then the user has manager role
      roleRequired: ['manager', 'admin'],
      swagger: {
        tags: [
          CatalogV1.swagger.tags.api,
        ],
        summary: 'Delete API.',
        description: descriptionApis.delete,
        parameters: [
          CatalogV1.swagger.params.apiId,
        ],
        responses: {
          204: {
            description: 'API removed successfully.',
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

        // API must exist
        if (!api) {
          // API doesn't exist
          return errorMessagePayload(404, 'API with specified ID is not found.');
        }

        // User must be able to manage API
        if (!api.currentUserCanManage(userId)) {
          return errorMessagePayload(403, 'User does not have permission to remove this API.');
        }

        // Remove API document
        Meteor.call('removeApi', api._id);

        // No content with 204
        return {
          statusCode: 204,
          body: {
            status: 'success',
            message: 'API removed',
          },
        };
      },
    },
  },
});


// Request /rest/v1/apis/:id/documents/
CatalogV1.addRoute('apis/:id/documents', {
  // Remove documentation from given API (:id) either completely or partially
  delete: {
    authRequired: true,
    swagger: {
      tags: [
        CatalogV1.swagger.tags.api,
      ],
      summary: 'Delete identified documentation or all documentation.',
      description: descriptionApis.deleteDocumentation,
      parameters: [
        CatalogV1.swagger.params.apiId,
        CatalogV1.swagger.params.url,
      ],
      responses: {
        200: {
          description: 'API documentation updated successfully',
          schema: {
            type: 'object',
            properties: {
              status: {
                type: 'string',
                example: 'Success',
              },
              data: {
                $ref: '#/definitions/apiResponse',
              },
            },
          },
        },
        400: {
          description: 'Bad Request. Erroneous or missing parameter.',
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

      // API must exist
      if (!api) {
        // API doesn't exist
        return errorMessagePayload(404, 'API with specified ID is not found.');
      }

      // User must be able to manage API
      if (!api.currentUserCanManage(userId)) {
        return errorMessagePayload(403, 'User does not have permission to this API.');
      }

      // Check if documentation exists
      const apiDoc = ApiDocs.findOne({ apiId });

      if (!apiDoc) {
        return errorMessagePayload(404, 'No documentation exists for this API.');
      }

      // Check if link for openAPI documentation was given
      const documentUrl = this.queryParams.url;

      // Remove identified documentation link
      if (documentUrl) {
        // Check if it is openAPI documentation or external documentation link
        if (documentUrl === apiDoc.remoteFileUrl) {
          // Matching link found as openAPI documentatin, try to remove
          const removeResult = ApiDocs.update(
            { apiId },
            { $unset: {
              remoteFileUrl: '',
            },
            },
          );
          // If removal of openAPI document link failed
          if (removeResult === 0) {
            const message = 'OpenAPI Documentation link removal failure.';
            return errorMessagePayload(500, message, 'url', documentUrl);
          }
        } else if (apiDoc.otherUrl.includes(documentUrl)) {
          // Matching link found as external documentatin, try to remove
          const removeResult = ApiDocs.update(
            { apiId },
            { $pull: { otherUrl: documentUrl } },
          );
          // If removal of external document link failed
          if (removeResult === 0) {
            const message = 'External Documentation link removal failure.';
            return errorMessagePayload(500, message, 'url', documentUrl);
          }
        } else {
          // No matching link found
          const message = 'Documentation link match not found.';
          return errorMessagePayload(404, message, 'url', documentUrl);
        }
      } else {
        // Remove all documentation, because no link identified
        Meteor.call('removeApiDoc', apiId);
      }

      // Prepare data to response, extend it with Documentation URLs
      const responseData = Object.assign(
        // API has not changed, use already fetched value
        api,
        // Get updated values of Documentation urls
        {
          externalDocumentation: api.otherUrl(),
          documentationUrl: api.documentationUrl(),
        });

      // OK response with API data
      return {
        statusCode: 200,
        body: {
          status: 'success',
          data: responseData,
        },
      };
    },
  },
});
