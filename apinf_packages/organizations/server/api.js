/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Collection imports
import ManagementV1 from '/apinf_packages/rest_apis/server/management';
import Organizations from '/apinf_packages/organizations/collection';
import { Accounts } from 'meteor/accounts-base';

// Request /rest/v1/organizations for Organizations collection
ManagementV1.addRoute('organizations', {
  // Return a list of organizations
  get: {
    swagger: {
      tags: [
        ManagementV1.swagger.tags.organization,
      ],
      summary: 'List and search organizations.',
      description: `
   ### List and search organizations ###

   Parameters are optional and several parametes can be combined.

   Example calls:

    GET /organizations

   As a response all Organizations' datas are listed.

    GET /organizations?q=apinf&limit=10

   As a response is returned up to ten first Organizations,
   which contain string "apinf" in Name, Description or URL.

      `,
      parameters: [
        ManagementV1.swagger.params.optionalSearch,
        ManagementV1.swagger.params.skip,
        ManagementV1.swagger.params.limit,
      ],
      responses: {
        200: {
          description: 'Returns a list of organizations',
          schema: {
            type: 'object',
            properties: {
              status: {
                type: 'string',
                example: 'success',
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
          status: 'success',
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
        ManagementV1.swagger.tags.organization,
      ],
      summary: 'Add a new Organization.',
      description: `
   ### Adds a new Organization ###

   Admin user can add a new Organization into Catalog.

   Parameters:
   * *name* and *url* are mandatory parameters
   * *description* length must not exceed 1000 characters.

   On success, a response message with HTTP code 201 returns the created organization data.
      `,
      parameters: [
        ManagementV1.swagger.params.organization,
      ],
      responses: {
        201: {
          description: 'Organization added successfully',
          schema: {
            type: 'object',
            properties: {
              status: {
                type: 'string',
                example: 'success',
              },
              data: {
                $ref: '#/definitions/organizationResponse',
              },
            },
          },
        },
        400: {
          description: 'Bad Request',
          schema: {
            type: 'object',
            properties: {
              status: {
                type: 'string',
                example: 'fail',
              },
              message: {
                type: 'string',
                example: 'Parameter "name" is erroneous or missing',
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

      // Validate name
      let isValid = Organizations.simpleSchema().namedContext().validateOne(
        organizationData, 'name');

      if (!isValid) {
        return {
          statusCode: 400,
          body: {
            status: 'fail',
            message: 'Parameter "name" is erroneous or missing',
          },
        };
      }

      // Validate url
      isValid = Organizations.simpleSchema().namedContext().validateOne(
        organizationData, 'url');

      if (!isValid) {
        return {
          statusCode: 400,
          body: {
            status: 'fail',
            message: 'Parameter "url" is erroneous or missing',
          },
        };
      }

      // Validate description, if provided
      if (bodyParams.description) {
        isValid = Organizations.simpleSchema().namedContext().validateOne(
          organizationData, 'description');

        if (!isValid) {
          return {
            statusCode: 400,
            body: {
              status: 'fail',
              message: 'Parameter "description" is erroneous or too long',
            },
          };
        }
      }

      const organizationId = Organizations.insert(organizationData);

      return {
        statusCode: 201,
        body: {
          status: 'success',
          data: Organizations.findOne(organizationId),
        },
      };
    },
  },
});

// Request /rest/v1/organizations/:id for Organizations collection
ManagementV1.addRoute('organizations/:id', {
  // Return the entity with the given :id
  get: {
    authRequired: false,
    swagger: {
      tags: [
        ManagementV1.swagger.tags.organization,
      ],
      summary: 'Fetch Organization with specified ID.',
      description: `
   ### List the data of the Organization specified with ID ###

   Example call

    GET /organizations/:id

   Returns the data of the Organization specified with :id in case a match is found.

      `,
      parameters: [
        ManagementV1.swagger.params.organizationId,
      ],
      responses: {
        200: {
          description: 'Organization found',
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
          description: 'Organization not found',
        },
      },
    },
    action () {
      const organizationId = this.urlParams.id;
      if (!organizationId) {
        return {
          statusCode: 404,
          body: {
            status: 'fail',
            message: 'Organization ID not provided',
          },
        };
      }

      const organization = Organizations.findOne(organizationId);

      /* Note! This one catches the case when user aims at
               organization/:id/managers
               but :id is missing. --> organization/managers
       */
      if (!organization) {
        const detailLine = `Organization with specified ID (${this.urlParams.id}) is not found`;
        return {
          statusCode: 404,
          body: {
            status: 'fail',
            message: detailLine,
          },
        };
      }

      return {
        statusCode: 200,
        body: {
          status: 'success',
          data: organization,
        },
      };
    },
  },
  // Modify the entity with the given :id with the data contained in the request body.
  put: {
    authRequired: true,
    swagger: {
      tags: [
        ManagementV1.swagger.tags.organization,
      ],
      summary: 'Update Organization.',
      description: `
   ### Update an Organization ###

   Admin user or Organization manager can update Organization data with parameters listed below.

   Parameters
   * can be given one by one or several ones at a time
   * length of parameter *description* must not exceed 1000 characters

      `,
      parameters: [
        ManagementV1.swagger.params.organizationId,
        ManagementV1.swagger.params.organization,
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
        400: {
          description: 'Bad Request',
          schema: {
            type: 'object',
            properties: {
              status: {
                type: 'string',
                example: 'fail',
              },
              message: {
                type: 'string',
                example: 'Parameter "description" is erroneous or too long',
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
      // Check if Organization exists
      if (!organization) {
        // Organization doesn't exist
        return {
          statusCode: 404,
          body: {
            status: 'fail',
            message: 'Organization with specified ID is not found',
          },
        };
      }
      // Get ID of User
      const userId = this.userId;
      const userCanManage = Meteor.call('userCanManageOrganization', userId, organization);

      // Make sure user has permission for action
      if (!userCanManage) {
        // Organization exists but user can not manage
        return {
          statusCode: 403,
          body: {
            status: 'fail',
            message: 'You do not have permission for editing this Organization',
          },
        };
      }
      // Get data from body parameters
      const bodyParams = this.bodyParams;

      // If bodyParams doesn't contain any fields
      // then organizationData JSON doesn't contain it as well
      const organizationData = {
        name: bodyParams.name,
        url: bodyParams.url,
        description: bodyParams.description,

        'contact.person': bodyParams.contact_name,
        'contact.phone': bodyParams.contact_phone,
        'contact.email': bodyParams.contact_email,

        'socialMedia.facebook': bodyParams.facebook,
        'socialMedia.instagram': bodyParams.instagram,
        'socialMedia.twitter': bodyParams.twitter,
        'socialMedia.linkedIn': bodyParams.linkedIn,
      };

      // Validate description, if provided
      if (bodyParams.description) {
        const isValid = Organizations.simpleSchema().namedContext().validateOne(
          organizationData, 'description');

        if (!isValid) {
          return {
            statusCode: 400,
            body: {
              status: 'fail',
              message: 'Parameter "description" is erroneous or too long',
            },
          };
        }
      }


      // Update Organization document
      Organizations.update(organizationId, { $set: organizationData });

      return {
        statusCode: 200,
        body: {
          status: 'success',
          data: Organizations.findOne(organizationId),
        },
      };
    },
  },

  delete: {
    authRequired: true,
    swagger: {
      tags: [
        ManagementV1.swagger.tags.organization,
      ],
      summary: 'Delete identified Organization from catalog.',
      description: `
   ### Deletes the identified Organization from catalog ###

   Admin user or Organization manager can remove Organization from Catalog.

   In successful case a response message with HTTP code 204 without any content is returned.
   Note! Trying to remove a non-existing Organization is considered a failed operation.

      `,
      parameters: [
        ManagementV1.swagger.params.organizationId,
      ],
      responses: {
        204: {
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
      if (!organization) {
        // Organization doesn't exist
        return {
          statusCode: 404,
          body: {
            status: 'fail',
            message: 'Organization with specified ID is not found',
          },
        };
      }
        // Get User ID
      const userId = this.userId;
      const userCanManage = Meteor.call('userCanManageOrganization', userId, organization);

      // User has to have permission for action
      if (!userCanManage) {
        return {
          statusCode: 403,
          body: {
            status: 'fail',
            message: 'You do not have permission for removing this Organization',
          },
        };
      }

      // Remove Organization document
      Meteor.call('removeOrganization', organization._id);

      return {
        statusCode: 204,
        body: {
          status: 'success',
        },
      };
    },
  },
});

// Request /rest/v1/organizations/:id/managers for Organizations collection
ManagementV1.addRoute('organizations/:id/managers', {
  // Query the manager list or add new managers into it
  get: {
    authRequired: true,
    swagger: {
      tags: [
        ManagementV1.swagger.tags.organization,
      ],
      summary: 'Get Organization Manager list.',
      description: `
   ### Listing all Organization Managers ###

   Admin user or Organization manager can list all Organization managers'
   username, email address and ID of Organization identified with :id.

   Two lists are returned:
   * managerIds: list of all Managers' IDs
   * data: list (matching to query parameters) of Managers with contact information

   Note! The lists can differ from each other in such a case a Manager account is removed,
   but the Manager list is not updated accordingly.


   Example call:

    GET /organizations/<organization_id>/managers


      `,
      parameters: [
        ManagementV1.swagger.params.organizationId,
      ],
      responses: {
        200: {
          description: 'Returns list of organization\'s managers',
          schema: {
            type: 'object',
            properties: {
              status: {
                type: 'string',
                example: 'Success',
              },
              managerIds: {
                type: 'array',
                items: {
                  type: 'string',
                  example: 'user-id-value',
                },
              },
              data: {
                type: 'array',
                items: {
                  $ref: '#/definitions/organizationManagerResponse',
                },
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
          description: 'Not Found',
          schema: {
            type: 'object',
            properties: {
              status: {
                type: 'string',
                example: 'fail',
              },
              message: {
                type: 'string',
                example: 'Organization with specified ID is not found',
              },
            },
          },
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
      // Note! It can not be checked here, if this parameter is not provided,
      //       because in that case the parameters are shifted and endpoint is not found at all.

      // Get Organization document
      const organization = Organizations.findOne(organizationId);
      // Organization doesn't exist
      /* Note! This one does NOT catch the case when user aims at
               organization/:id/managers/managerId
               but :id is missing.
               Because in that case --> organization/managers/:managerId
               - organizationId is 'managers', although an ID was wxpected
               - endpoint is :managerId, although 'managers' was expected
        Only with organization/managers/managers is caught here!
       */

      if (!organization) {
        const detailLine = `Organization with specified ID (${this.urlParams.id}) is not found`;
        return {
          statusCode: 404,
          body: {
            status: 'fail',
            message: detailLine,
          },
        };
      }

      // Get ID of requesting User
      const requestorId = this.userId;

      const userCanManage = Meteor.call('userCanManageOrganization', requestorId, organization);
      // Requestor must have permission for action
      if (!userCanManage) {
        return {
          statusCode: 403,
          body: {
            status: 'fail',
            message: 'You do not have permission for editing this Organization',
          },
        };
      }

      // Do not include password in response
      const options = {};
      const includeFields = {};
      includeFields._id = 1;
      includeFields.username = 1;
      includeFields.emails = 1;
      options.fields = includeFields;

      return {
        statusCode: 200,
        body: {
          status: 'success',
          managerIds: organization.managerIds,
          data: Meteor.users.find({ _id: { $in: organization.managerIds } }, options).fetch(),
        },
      };
    },
  },

  // Add a new manager to Organization
  post: {
    authRequired: true,
    roleRequired: ['admin', 'manager'],
    swagger: {
      tags: [
        ManagementV1.swagger.tags.organization,
      ],
      summary: 'Add a new Manager into Organization.',
      description: `
   ### Adds a new Manager into Organization ###

   Admin user or Organization manager can add a new manager into organization.

   * Manager is identified with email address.
   * New manager must have a valid User account.
   * New manager must not already be a Manager in same Organization.

   On success, a complete list of Organization Managers is returned.
      `,
      parameters: [
        ManagementV1.swagger.params.organizationId,
        ManagementV1.swagger.params.newManagerEmail,
      ],
      responses: {
        200: {
          description: 'Organization Manager added successfully',
          schema: {
            type: 'object',
            properties: {
              status: {
                type: 'string',
                example: 'success',
              },
              managerIds: {
                type: 'array',
                items: {
                  type: 'string',
                  example: 'user-id-value',
                },
              },

              data: {
                $ref: '#/definitions/organizationManagerResponse',
              },
            },
          },
        },
        400: {
          description: 'Bad Request',
          schema: {
            type: 'object',
            properties: {
              status: {
                type: 'string',
                example: 'fail',
              },
              message: {
                type: 'string',
                example: 'New Manager\'s email address is missing',
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
          description: 'Not Found',
          schema: {
            type: 'object',
            properties: {
              status: {
                type: 'string',
                example: 'fail',
              },
              message: {
                type: 'string',
                example: 'Organization with specified ID is not found',
              },
            },
          },
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
      // Get ID of Organization
      // Note! It can not be checked here, if this parameter is not provided,
      //       because in that case the parameters are shifted and endpoint is not found at all.
      const organizationId = this.urlParams.id;

      // Get Organization document
      let organization = Organizations.findOne(organizationId);
      // Organization doesn't exist
      if (!organization) {
        return {
          statusCode: 404,
          body: {
            status: 'fail',
            message: 'Organization with specified ID is not found',
          },
        };
      }

      // Get ID of requesting User
      const userId = this.userId;

      const userCanManage = Meteor.call('userCanManageOrganization', userId, organization);
      // Requestor does not have permission for action
      if (!userCanManage) {
        // Organization exists but user can not manage
        return {
          statusCode: 403,
          body: {
            status: 'fail',
            message: 'You do not have permission to edit this Organization',
          },
        };
      }

      // Check if manager list is given
      if (!bodyParams.newManagerEmail) {
        return {
          statusCode: 400,
          body: {
            status: 'fail',
            message: 'New Manager\'s email address is missing.',
          },
        };
      }

      // Get user account with matching email
      const newManager = Accounts.findUserByEmail(bodyParams.newManagerEmail);

      if (!newManager) {
        return {
          statusCode: 400,
          body: {
            status: 'fail',
            message: 'User has no account',
          },
        };
      }

      // Check if user is already a manager
      const alreadyManager = organization.managerIds.includes(newManager._id);
      // Check if the user is already a manager
      if (alreadyManager) {
        return {
          statusCode: 400,
          body: {
            status: 'fail',
            message: 'User is already a Manager in this Organization',
          },
        };
      }

      // Update Organization manager list
      Organizations.update(organizationId, { $push: { managerIds: newManager._id } });

      // Do not include password in response
      const options = {};
      const includeFields = {};
      includeFields._id = 1;
      includeFields.username = 1;
      includeFields.emails = 1;
      options.fields = includeFields;

      // Get Organization document after managerIds update
      organization = Organizations.findOne(organizationId);

      return {
        statusCode: 200,
        body: {
          status: 'success',
          managerIds: organization.managerIds,
          data: Meteor.users.find({ _id: { $in: organization.managerIds } }, options).fetch(),
        },
      };
    },
  },

});

// Request /rest/v1/organizations/:id/managers/:managerId
ManagementV1.addRoute('organizations/:id/managers/:managerId', {
  // Get contact information of a manager (:managerId) in given Organization (:id)
  get: {
    authRequired: true,
    swagger: {
      tags: [
        ManagementV1.swagger.tags.organization,
      ],
      summary: 'Get Organization Manager username and email address.',
      description: `
   ### Inquiring Organization Manager's username and email address ###

   Admin user or Organization manager can fetch username and email address of a
   Manager identified by {managerId}.

   Example call:

    GET /organizations/<organizations id>/managers/<managers id>


      `,
      parameters: [
        ManagementV1.swagger.params.organizationId,
        ManagementV1.swagger.params.managerId,
      ],
      responses: {
        200: {
          description: 'Organization manager contact information.',
          schema: {
            type: 'object',
            properties: {
              data: {
                $ref: '#/definitions/organizationManagerResponse',
              },
            },
          },
        },
        400: {
          description: 'Bad Request',
          schema: {
            type: 'object',
            properties: {
              status: {
                type: 'string',
                example: 'fail',
              },
              message: {
                type: 'string',
                example: 'Organization ID was not provided',
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
          description: 'Not Found',
          schema: {
            type: 'object',
            properties: {
              status: {
                type: 'string',
                example: 'fail',
              },
              message: {
                type: 'string',
                example: 'Organization with specified ID is not found',
              },
            },
          },
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
      // Is Organization ID provided
      if (!this.urlParams.id) {
        return {
          statusCode: 400,
          body: {
            status: 'fail',
            message: 'Organization ID was not provided',
          },
        };
      }
      // Get ID of Organization from request parameter
      // Note! It can not be checked here, if this parameter is not provided,
      //       because in that case the parameters are shifted and endpoint is not found at all.
      const organizationId = this.urlParams.id;

      // Get Organization document
      const organization = Organizations.findOne(organizationId);
      // Organization must exist
      if (!organization) {
        return {
          statusCode: 404,
          body: {
            status: 'fail',
            message: 'Organization with specified ID is not found',
          },
        };
      }

      // Get ID of User requesting operation
      const requestorId = this.userId;

      const userCanManage = Meteor.call('userCanManageOrganization', requestorId, organization);
      // Requestor must have permissions for action
      if (!userCanManage) {
        return {
          statusCode: 403,
          body: {
            status: 'fail',
            message: 'You do not have permission for editing this Organization',
          },
        };
      }

      // Get ID of queried Manager from request parameter
      const managerId = this.urlParams.managerId;
      // Queried Manager ID must be given
      if (!managerId) {
        return {
          statusCode: 400,
          body: {
            status: 'fail',
            message: 'Manager ID was not provided.',
          },
        };
      }

      // Check if user account for manager exists
      if (!Meteor.users.findOne(managerId)) {
        return {
          statusCode: 400,
          body: {
            status: 'fail',
            message: 'User has no User account.',
          },
        };
      }

      // Is user a manager of Organization?
      const isManager = organization.managerIds.includes(managerId);
      if (!isManager) {
        return {
          statusCode: 400,
          body: {
            status: 'fail',
            message: 'Queried User is not a Manager in Organization.',
          },
        };
      }

      // Do not include password in response
      const options = {};
      const includeFields = {};
      includeFields._id = 1;
      includeFields.username = 1;
      includeFields.emails = 1;
      options.fields = includeFields;

      return {
        statusCode: 200,
        body: {
          status: 'success',
          data: Meteor.users.findOne({ _id: managerId }, options),
        },
      };
    },
  },

  // Remove a manager (:managerId) from given Organization (:id)
  delete: {
    authRequired: true,
    swagger: {
      tags: [
        ManagementV1.swagger.tags.organization,
      ],
      summary: 'Delete identified Manager from Organization Manager list.',
      description: `
   ### Deleting a User from Organization Manager list ###

   Admin user or Organization manager can delete managers from Organization manager list one by one.


   Example call:

    DELETE /organizations/<organizations id>/managers/<managers id>


   Note! Trying to remove a not existing Manager is considered a failed operation.
      `,
      parameters: [
        ManagementV1.swagger.params.organizationId,
        ManagementV1.swagger.params.managerId,
      ],
      responses: {
        200: {
          description: 'Organization Manager successfully removed.',
          schema: {
            type: 'object',
            properties: {
              data: {
                $ref: '#/definitions/organizationManagerResponse',
              },
            },
          },
        },
        400: {
          description: 'Bad Request',
        },
        401: {
          description: 'Authentication is required',
        },
        403: {
          description: 'Forbidden operation',
        },
        404: {
          description: 'Not Found',
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
      // Note! It can not be checked here, if this parameter is not provided,
      //       because in that case the parameters are shifted and endpoint is not found at all.

      // Get Organization document
      const organization = Organizations.findOne(organizationId);
      // Organization must exist
      if (!organization) {
        return {
          statusCode: 404,
          body: {
            status: 'fail',
            message: 'Organization with specified ID is not found',
          },
        };
      }

      // Get ID of requesting User
      const requestorId = this.userId;

      const userCanManage = Meteor.call('userCanManageOrganization', requestorId, organization);
      // Requestor must have permission for action
      if (!userCanManage) {
        return {
          statusCode: 403,
          body: {
            status: 'fail',
            message: 'You do not have permission for editing this Organization',
          },
        };
      }

      // Get ID of Manager to be removed
      const removeManagerId = this.urlParams.managerId;
      // Manager ID must be given
      if (!removeManagerId) {
        return {
          statusCode: 400,
          body: {
            status: 'fail',
            message: 'Missing parameter: Manager ID not provided.',
          },
        };
      }

      // Admin/Manager is not allowed to remove self
      if (removeManagerId === requestorId) {
        return {
          statusCode: 403,
          body: {
            status: 'fail',
            message: 'User can not remove self.',
          },
        };
      }

      // Only existing Manager can be removed from Organization manager list
      const isManager = organization.managerIds.includes(removeManagerId);

      if (!isManager) {
        return {
          statusCode: 404,
          body: {
            status: 'fail',
            message: 'Bad parameter: Manager not found in Organization.',
          },
        };
      }

      // Remove user from organization manager list
      Meteor.call('removeOrganizationManager', organizationId, removeManagerId);

      // Do not include password in response
      const options = {};
      const includeFields = {};
      includeFields._id = 1;
      includeFields.username = 1;
      includeFields.emails = 1;
      options.fields = includeFields;

      return {
        statusCode: 200,
        body: {
          status: 'success',
          managerIds: organization.managerIds,
          data: Meteor.users.find({ _id: { $in: organization.managerIds } }, options).fetch(),
        },
      };
    },
  },
});
