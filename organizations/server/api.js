/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Collection imports
import MaintenanceV1 from '/core/server/maintenance';
import Organizations from '/organizations/collection';

// Request /rest/v1/organizations for Organizations collection
MaintenanceV1.addRoute('organizations', {
  // Return a list of organizations
  get: {
    swagger: {
      tags: [
        MaintenanceV1.swagger.tags.organization,
      ],
      summary: 'List and search organizations.',
      description: 'List and search organizations.',
      parameters: [
        MaintenanceV1.swagger.params.optionalSearch,
        MaintenanceV1.swagger.params.skip,
        MaintenanceV1.swagger.params.limit,
      ],
      responses: {
        200: {
          description: 'Returns list of organizations',
          schema: {
            type: 'object',
            properties: {
              status: {
                type: 'string',
                example: 'Success',
              },
              data: {
                type: 'array',
                items: {
                  $ref: '#/definitions/organizationResponse',
                },
              },
            },
          },
        },
        400: {
          description: 'Bad query parameters',
        },
      },
    },
    action () {
      const queryParams = this.queryParams;

      // Create placeholders
      const query = {};
      const options = {};

      // Parse query parameters
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
          {
            url: {
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
          status: 'Success',
          data: Organizations.find(query, options).fetch(),
        },
      };
    },
  },
  post: {
    authRequired: true,
    roleRequired: ['admin'],
    swagger: {
      tags: [
        MaintenanceV1.swagger.tags.organization,
      ],
      summary: 'Add Organization to catalog.',
      description: 'Adds an Organization to catalog. On success, returns newly added object.',
      parameters: [
        MaintenanceV1.swagger.params.organization,
      ],
      responses: {
        200: {
          description: 'Organization successfully added',
          schema: {
            type: 'object',
            properties: {
              status: {
                type: 'string',
                example: 'Success',
              },
              data: {
                $ref: '#/definitions/organizationResponse',
              },
            },
          },
        },
        401: {
          description: 'Authentication is required',
        },
        403: {
          description: 'User does not have permission',
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
      const userId = this.userId;

      // If bodyParams doesn't contain any fields
      // then organizationData JSON doesn't contain it as well
      const organizationData = {
        name: bodyParams.name,
        url: bodyParams.url,
        description: bodyParams.description,
        managerIds: [userId],
        createdBy: userId,
        contact: {
          person: bodyParams.contact_name,
          phone: bodyParams.contact_phone,
          email: bodyParams.contact_email,
        },
        socialMedia: {
          facebook: bodyParams.facebook,
          instagram: bodyParams.instagram,
          twitter: bodyParams.twitter,
          linkedIn: bodyParams.linkedin,
        },
      };

      const organizationId = Organizations.insert(organizationData);

      return {
        status: 'Success',
        data: Organizations.findOne(organizationId),
      };
    },
  },
});

// Request /rest/v1/organizations/:id for Organizations collection
MaintenanceV1.addRoute('organizations/:id', {
  // Return the entity with the given :id
  get: {
    authRequired: false,
    swagger: {
      tags: [
        MaintenanceV1.swagger.tags.organization,
      ],
      summary: 'Fetch Organization with specified ID.',
      description: 'Returns one Organization with specified ID or nothing if not match found.',
      parameters: [
        MaintenanceV1.swagger.params.organizationId,
      ],
      responses: {
        200: {
          description: 'Returns organization',
          schema: {
            type: 'object',
            properties: {
              data: {
                $ref: '#/definitions/organizationResponse',
              },
            },
          },
        },
        404: {
          description: 'Bad parameter',
        },
      },
    },
    action () {
      const organizationId = this.urlParams.id;

      const organization = Organizations.findOne(organizationId);

      if (organization) {
        return {
          statusCode: 200,
          body: {
            data: organization,
          },
        };
      }

      return {
        statusCode: 404,
        body: {
          status: 'fail',
          message: 'Organization is not found with specified ID',
        },
      };
    },
  },
  // Modify the entity with the given :id with the data contained in the request body.
  put: {
    authRequired: true,
    swagger: {
      tags: [
        MaintenanceV1.swagger.tags.organization,
      ],
      summary: 'Update Organization.',
      description: 'Update an Organization.',
      parameters: [
        MaintenanceV1.swagger.params.organizationId,
        MaintenanceV1.swagger.params.organization,
      ],
      responses: {
        200: {
          description: 'Organization successfully edited.',
          schema: {
            type: 'object',
            properties: {
              data: {
                $ref: '#/definitions/organizationResponse',
              },
            },
          },
        },
        401: {
          description: 'Authentication is required',
        },
        403: {
          description: 'User does not have permission',
        },
        404: {
          description: 'Organization is not found',
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
      // Get ID of Organization
      const organizationId = this.urlParams.id;
      // Get Organization document
      const organization = Organizations.findOne(organizationId);

      if (organization) {
        // Get ID of User
        const userId = this.userId;
        const userCanManage = Meteor.call('userCanManageOrganization', userId, organization);

        // Make sure user has permission for action
        if (userCanManage) {
          // Get data from body parameters
          const bodyParams = this.bodyParams;

          // If bodyParams doesn't contain any fields
          // then organizationData JSON doesn't contain it as well
          const organizationData = {
            name: bodyParams.name,
            url: bodyParams.url,
            description: bodyParams.description,

            contact: {
              person: bodyParams.contact_name,
              phone: bodyParams.contact_phone,
              email: bodyParams.contact_email,
            },
            socialMedia: {
              facebook: bodyParams.facebook,
              instagram: bodyParams.instagram,
              twitter: bodyParams.twitter,
              linkedIn: bodyParams.linkedin,
            },
          };

          // Update Organization document
          Organizations.update(organizationId, { $set: organizationData });

          return {
            statusCode: 200,
            body: {
              status: 'Success updating',
              data: Organizations.findOne(organizationId),
            },
          };
        }

        // Organization exists but user can not manage
        return {
          statusCode: 403,
          body: {
            status: 'Fail',
            message: 'You do not have permission for editing this Organization',
          },
        };
      }

      // Organization doesn't exist
      return {
        statusCode: 404,
        body: {
          status: 'Fail',
          message: 'Organization is not found with specified ID',
        },
      };
    },
  },
  delete: {
    authRequired: true,
    swagger: {
      tags: [
        MaintenanceV1.swagger.tags.organization,
      ],
      summary: 'Delete identified Organization from catalog.',
      description: 'Deletes the identified Organization from catalog.',
      parameters: [
        MaintenanceV1.swagger.params.organizationId,
      ],
      responses: {
        200: {
          description: 'Organization successfully removed.',
        },
        401: {
          description: 'Authentication is required',
        },
        403: {
          description: 'User does not have permission',
        },
        404: {
          description: 'Organization is not found',
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
      // Get ID of Organization
      const organizationId = this.urlParams.id;

      // Get organization document
      const organization = Organizations.findOne(organizationId);

      // Make sure Organization exists
      if (organization) {
        // Get User ID
        const userId = this.userId;
        const userCanManage = Meteor.call('userCanManageOrganization', userId, organization);

        // User has permission for action
        if (userCanManage) {
          // Remove Organization document
          Meteor.call('removeOrganization', organization._id);

          return {
            statusCode: 200,
            body: {
              status: 'Organization successfully removed',
            },
          };
        }

        // User doesn't have permission for action
        return {
          statusCode: 403,
          body: {
            status: 'Fail',
            message: 'You do not have permission for removing this Organization',
          },
        };
      }

      // Organization doesn't exist
      return {
        statusCode: 404,
        body: {
          status: 'Fail',
          message: 'Organization is not found with specified ID',
        },
      };
    },
  },
});
