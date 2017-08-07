/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Collection imports
import MaintenanceV1 from '/core/server/api/maintenance';
import Organizations from '/organizations/collection';
import { Accounts } from 'meteor/accounts-base';

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
          title: 'Success',
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
        statusCode: 200,
        body: {
          title: 'Organization added successfully',
          data: Organizations.findOne(organizationId),
        },
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
            title: 'Organization found',
            data: organization,
          },
        };
      }

      return {
        statusCode: 404,
        body: {
          title: 'Organization not found',
          detail: 'Organization with specified ID is not found',
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
      description: `
   ### Update an Organization ###

   You can update Organization data with parameters listed below.

   Parameters can be given one by one or several ones at a time.
      `,
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

            'contact.person': bodyParams.contact_name,
            'contact.phone': bodyParams.contact_phone,
            'contact.email': bodyParams.contact_email,

            'socialMedia.facebook': bodyParams.facebook,
            'socialMedia.instagram': bodyParams.instagram,
            'socialMedia.twitter': bodyParams.twitter,
            'socialMedia.linkedIn': bodyParams.linkedIn,
          };

          // Update Organization document
          Organizations.update(organizationId, { $set: organizationData });

          return {
            statusCode: 200,
            body: {
              title: 'Organization updated successfully',
              data: Organizations.findOne(organizationId),
            },
          };
        }

        // Organization exists but user can not manage
        return {
          statusCode: 403,
          body: {
            title: 'User does not have permission',
            detail: 'You do not have permission for editing this Organization',
          },
        };
      }

      // Organization doesn't exist
      return {
        statusCode: 404,
        body: {
          title: 'Organization is not found',
          detail: 'Organization with specified ID is not found',
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
              title: 'Organization removed successfully',
            },
          };
        }

        // User doesn't have permission for action
        return {
          statusCode: 403,
          body: {
            title: 'User does not have permission',
            detail: 'You do not have permission for removing this Organization',
          },
        };
      }

      // Organization doesn't exist
      return {
        statusCode: 404,
        body: {
          title: 'Organization is not found',
          detail: 'Organization with specified ID is not found',
        },
      };
    },
  },
});

// Request /rest/v1/organizations/:id/managers for Organizations collection
MaintenanceV1.addRoute('organizations/:id/managers', {
  // Query the manager list or add new managers into it
  get: {
    authRequired: true,
    swagger: {
      tags: [
        MaintenanceV1.swagger.tags.organization,
      ],
      summary: 'Get Organization Manager list.',
      description: `
   ### Listing all Organization Managers ###

   By giving Organization ID you can fetch all Managers'
   username, email address and ID listed.

   There is returned two lists:
   * managerIds: list of all Managers' IDs
   * data: list (matching to query parameters) of Managers with contact information

   The lists can differ from each other in such a case a Manager account is removed,
   but the Manager list is not updated accordingly.
      `,
      parameters: [
        MaintenanceV1.swagger.params.organizationId,
        MaintenanceV1.swagger.params.managerUsername,
        MaintenanceV1.swagger.params.managerEmail,
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
          description: 'Bad parameter',
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
      // Organization ID was not provided
      if (!organizationId) {
        return {
          statusCode: 404,
          body: {
            title: 'Organization ID was not provided',
            detail: 'Bad parameter: Organization ID was not provided',
          },
        };
      }

      // Get Organization document
      const organization = Organizations.findOne(organizationId);
      // Organization doesn't exist
      if (!organization) {
        return {
          statusCode: 404,
          body: {
            title: 'Organization not found',
            detail: 'Bad parameter: Organization not found',
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
            title: 'Forbidden operation',
            detail: 'You do not have permission for editing this Organization',
          },
        };
      }
      // Use list in final query
      let managerSearchList = [];
      // Is query limited by manager email or username
      if (this.queryParams.managerEmail || this.queryParams.managerUsername) {
        const managerEmail = this.queryParams.managerEmail;

        if (managerEmail) {
          // Get user account with matching email
          const managerByEmail = Accounts.findUserByEmail(managerEmail);
          // Add found Manager ID into search list if Manager
          if (managerByEmail && organization.managerIds.includes(managerByEmail._id)) {
            managerSearchList.push(managerByEmail._id);
          }
        }

        const managerUsername = this.queryParams.managerUsername;

        if (managerUsername) {
          // Get user account with matching username
          const managerByUsername = Accounts.findUserByUsername(managerUsername);
          // Add found Manager ID into search list
          if (managerByUsername && organization.managerIds.includes(managerByUsername._id)) {
            // Add to list if not duplicate
            if (!managerSearchList.includes(managerByUsername._id)) {
              managerSearchList.push(managerByUsername._id);
            }
          }
        }
      } else {
        // Search with manager list
        managerSearchList = organization.managerIds;
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
          title: 'Organization managers found',
          managerIds: organization.managerIds,
          data: Meteor.users.find({ _id: { $in: managerSearchList } }, options).fetch(),
        },
      };
    },
  },

  post: {
    authRequired: true,
    roleRequired: ['admin', 'manager'],
    swagger: {
      tags: [
        MaintenanceV1.swagger.tags.organization,
      ],
      summary: 'Add a new Manager into Organization.',
      description: `
   Adds a new Manager into Organization.
   * Manager is identified with email address.
   * New manager must have a valid User account.
   * New manager must not already be a Manager in this Organization.

   On success, complete list of Organization Managers is returned.
      `,
      parameters: [
        MaintenanceV1.swagger.params.organizationId,
        MaintenanceV1.swagger.params.newManagerEmail,
      ],
      responses: {
        200: {
          description: 'Organization Manager successfully added',
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
                $ref: '#/definitions/organizationManagerResponse',
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
          description: 'Bad parameter',
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
      const organizationId = this.urlParams.id;
      // Organization ID was not provided
      if (!organizationId) {
        return {
          statusCode: 404,
          body: {
            title: 'Organization ID was not provided',
            detail: 'Bad parameter: Organization ID was not provided',
          },
        };
      }

      // Get Organization document
      let organization = Organizations.findOne(organizationId);
      // Organization doesn't exist
      if (!organization) {
        return {
          statusCode: 404,
          body: {
            title: 'Organization not found',
            detail: 'Organization with specified ID is not found',
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
            title: 'Forbidden operation',
            detail: 'You do not have permission to edit this Organization',
          },
        };
      }

      // Check if manager list is given
      if (!bodyParams.newManagerEmail) {
        return {
          statusCode: 404,
          body: {
            title: 'Missing parameter',
            detail: 'New Manager\'s email address is missing.',
          },
        };
      }

      // Convert incoming parameter list (items separated with space) into array
      const newManagerEmail = bodyParams.newManagerEmail;

      // Check if manager list conversion was successful
      if (!newManagerEmail) {
        return {
          statusCode: 404,
          body: {
            title: 'Missing parameter',
            detail: 'New Manager email address missing.',
          },
        };
      }

      // Get user account with matching email
      const newManager = Accounts.findUserByEmail(newManagerEmail);

      if (!newManager) {
        return {
          statusCode: 404,
          body: {
            title: 'Bad parameter',
            detail: 'User has no account',
          },
        };
      }

      // Check if user is already a manager
      const alreadyManager = organization.managerIds.includes(newManager._id);
      // Check if the user is already a manager
      if (alreadyManager) {
        return {
          statusCode: 404,
          body: {
            title: 'Bad parameter',
            detail: 'User is already a Manager in this Organization',
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
          title: 'Manager(s) addedd successfully',
          managerIds: organization.managerIds,
          data: Meteor.users.find({ _id: { $in: organization.managerIds } }, options).fetch(),
        },
      };
    },
  },

});

// Request /rest/v1/organizations/:id/managers/:managerId
MaintenanceV1.addRoute('organizations/:id/managers/:managerId', {
  // Get contact information of a manager (:managerId) in given Organization (:id)
  get: {
    authRequired: true,
    swagger: {
      tags: [
        MaintenanceV1.swagger.tags.organization,
      ],
      summary: 'Get Organization Manager username and email address.',
      description: `
   ### Inquiring Organization Manager's username and email address ###

   By giving Organization Managers user ID you can fetch Manager's
   username and email address.
      `,
      parameters: [
        MaintenanceV1.swagger.params.organizationId,
        MaintenanceV1.swagger.params.managerId,
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
        401: {
          description: 'Authentication is required',
        },
        403: {
          description: 'User does not have permission',
        },
        404: {
          description: 'Bad parameter',
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
      // Get ID of Organization from request parameter
      const organizationId = this.urlParams.id;
      // Organization ID was not provided
      if (!organizationId) {
        return {
          statusCode: 404,
          body: {
            title: 'Organization ID was not provided',
            detail: 'Bad parameter: Organization ID was not provided',
          },
        };
      }
      // Get Organization document
      const organization = Organizations.findOne(organizationId);
      // Organization must exist
      if (!organization) {
        return {
          statusCode: 404,
          body: {
            title: 'Organization not found',
            detail: 'Bad parameter: Organization with specified ID is not found',
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
            title: 'Forbidden operation',
            detail: 'You do not have permission for editing this Organization',
          },
        };
      }

      // Get ID of queried Manager from request parameter
      const managerId = this.urlParams.managerId;
      // Queried Manager ID must be given
      if (!managerId) {
        return {
          statusCode: 404,
          body: {
            title: 'Parameter missing',
            detail: 'Manager ID is not given in request.',
          },
        };
      }

      // Check if user account for manager exists
      if (!Meteor.users.findOne(managerId)) {
        return {
          statusCode: 404,
          body: {
            title: 'Not found',
            detail: 'User has no User account.',
          },
        };
      }

      // Is user a manager of Organization?
      const isManager = organization.managerIds.includes(managerId);
      if (!isManager) {
        return {
          statusCode: 404,
          body: {
            title: 'Not found',
            detail: 'Queried User is not a Manager in Organization.',
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
          title: 'Manager found successfully',
          data: Meteor.users.findOne({ _id: managerId }, options),
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
      summary: 'Delete identified Manager from Organization Manager list.',
      description: `
   ### Deleting a User from Organization Manager list ###

   You can delete managers from Organization manager list one by one.

   Note! Removing not existing Manager ID from list is considered failed operation.
      `,
      parameters: [
        MaintenanceV1.swagger.params.organizationId,
        MaintenanceV1.swagger.params.managerId,
      ],
      responses: {
        200: {
          description: 'Organization Manager successfully removed.',
        },
        401: {
          description: 'Authentication is required',
        },
        403: {
          description: 'User does not have permission',
        },
        404: {
          description: 'Bad parameter',
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
      // Organization ID was not provided
      if (!organizationId) {
        return {
          statusCode: 404,
          body: {
            title: 'Organization ID was not provided',
            detail: 'Bad parameter: Organization ID was not provided',
          },
        };
      }
      // Get Organization document
      const organization = Organizations.findOne(organizationId);
      // Organization must exist
      if (!organization) {
        return {
          statusCode: 404,
          body: {
            title: 'Organization not found',
            detail: 'Organization with specified ID is not found',
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
            title: 'Forbidden operation',
            detail: 'You do not have permission for editing this Organization',
          },
        };
      }

      // Get ID of Manager to be removed
      const removeManagerId = this.urlParams.managerId;
      // Manager ID must be given
      if (!removeManagerId) {
        return {
          statusCode: 404,
          body: {
            title: 'Parameter not found',
            detail: 'Missing parameter: Manager ID not provided.',
          },
        };
      }

      // Admin/Manager is not allowed to remove self
      if (removeManagerId === requestorId) {
        return {
          statusCode: 403,
          body: {
            title: 'Removal not allowed',
            detail: 'Bad parameter: Can not remove self.',
          },
        };
      }

      // Only existing Manager can be removed from Organization manager list
      const isManager = organization.managerIds.includes(removeManagerId);

      if (!isManager) {
        return {
          statusCode: 404,
          body: {
            title: 'Manager not found',
            detail: 'Bad parameter: Manager not found in Organization.',
          },
        };
      }

      // Remove user from organization manager list
      Meteor.call('removeOrganizationManager', organizationId, removeManagerId);

      return {
        statusCode: 200,
        body: {
          title: 'Manager deleted successfully',
          message: 'Manager deleted successfully.',
        },
      };
    },
  },
});
