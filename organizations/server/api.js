/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Collection imports
import MaintenanceV1 from '/core/server/maintenance';
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

   By giving Organization ID you can fetch all Manager's
   username, email address and ID listed.

   There is returned two lists:
   * list of all Managers' IDs
   * list of Managers with contact information

   The lists are differing from each other in case a Manager account is removed,
   but the Manager list is not updated accordingly.
      `,
      parameters: [
        MaintenanceV1.swagger.params.organizationId,
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
              idList: {
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
          description: 'Organization Manager not found',
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
      // Organization doesn't exist
      if (!organization) {
        return {
          statusCode: 404,
          body: {
            status: 'Fail',
            message: 'Organization is not found with specified ID',
          },
        };
      }

      // Get ID of requesting User
      const requestorId = this.userId;

      const userCanManage = Meteor.call('userCanManageOrganization', requestorId, organization);
      // Requestor does not have permission for action
      if (!userCanManage) {
        // Organization exists but user can not manage
        return {
          statusCode: 403,
          body: {
            status: 'Fail',
            message: 'You do not have permission for editing this Organization',
          },
        };
      }

      // Do not include password in response
      const options = {};
      const excludeFields = {};
      excludeFields.services = 0;
      excludeFields.createdAt = 0;
      excludeFields.profile = 0;
      excludeFields.roles = 0;
      options.fields = excludeFields;

      return {
        statusCode: 200,
        body: {
          status: 'Success',
          idList: organization.managerIds,
          data: Meteor.users.find({ _id: { $in: organization.managerIds } }, options).fetch(),
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
      summary: 'Add one ore more new Managers into Organization.',
      description: `
   Adds one or more new Managers into Organization.
   On success, returns list of Organization Managers.
      `,
      parameters: [
        MaintenanceV1.swagger.params.managerEmailList,
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
              idList: {
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
      console.log('bodyParams=', bodyParams);
      // Get ID of Organization
      const organizationId = this.urlParams.id;
      // Get Organization document
      const organization = Organizations.findOne(organizationId);
      // Organization doesn't exist
      if (!organization) {
        return {
          statusCode: 404,
          body: {
            status: 'Fail',
            message: 'Organization is not found with specified ID',
          },
        };
      }

      // Get ID of requesting User
      const requestorId = this.userId;

      const userCanManage = Meteor.call('userCanManageOrganization', requestorId, organization);
      // Requestor does not have permission for action
      if (!userCanManage) {
        // Organization exists but user can not manage
        return {
          statusCode: 403,
          body: {
            status: 'Fail',
            message: 'You do not have permission for editing this Organization',
          },
        };
      }
      // Convert incoming parameter list (items separated with space) into array
      const managerEmails = bodyParams.managerEmail.split(/(\s+)/).filter((e) => {
        return e.trim().length > 0;
      });

      // Check if managers have accounts-base
      if (!managerEmails) {
        return {
          statusCode: 404,
          body: {
            status: 'Fail',
            message: 'New Manager email address(es) are missing.',
          },
        };
      }
      console.log('managerEmails= ', managerEmails);
      const updateManagerList = [];
      // Get User IDs for Manager list

      managerEmails.foreach((email) => {
        // Get user with matching email
        const user = Accounts.findUserByEmail(email);

        if (!user) {
          return {
            statusCode: 404,
            body: {
              status: 'Fail',
              message: 'No user account found',
              data: email,
            },
          };
        }

        // Check if user is already a manager
        const alreadyManager = organization.managerIds.includes(user._id);

        // Check if the user is already a manager
        if (alreadyManager) {
          return {
            statusCode: 404,
            body: {
              status: 'Fail',
              message: 'User is already a Manager in Organization',
              data: email,
            },
          };
        }
        // Add user ID to manager IDs field
        updateManagerList.push(user._id);
        return;
      });

      // Update Organization manager list
      Organizations.update(organizationId, { $push: { managerIds: updateManagerList } });


      // Do not include password in response
      const options = {};
      const excludeFields = {};
      excludeFields.services = 0;
      excludeFields.createdAt = 0;
      excludeFields.profile = 0;
      excludeFields.roles = 0;
      options.fields = excludeFields;

      return {
        statusCode: 200,
        body: {
          status: 'Success',
          idList: organization.managerIds,
          data: Meteor.users.find({ _id: { $in: organization.managerIds } }, options).fetch(),
        },
      };
    },
  },

});


// Request /rest/v1/organizations/:id/managers/:managerId for Organizations collection
MaintenanceV1.addRoute('organizations/:id/managers/:managerId', {
  // Modify the manager list of given entity :id
  // with the given :userId.
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
          description: 'Organization Manager not found',
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
      // Organization doesn't exist
      if (!organization) {
        return {
          statusCode: 404,
          body: {
            status: 'Fail',
            message: 'Organization is not found with specified ID',
          },
        };
      }

      // Get ID of requesting User
      const requestorId = this.userId;

      const userCanManage = Meteor.call('userCanManageOrganization', requestorId, organization);
      // Requestor does not have permission for action
      if (!userCanManage) {
        // Organization exists but user can not manage
        return {
          statusCode: 403,
          body: {
            status: 'Fail',
            message: 'You do not have permission for editing this Organization',
          },
        };
      }

      // Get ID of new Manager
      const managerId = this.urlParams.managerId;
      // Manager ID was not given
      if (!managerId) {
        return {
          statusCode: 404,
          body: {
            status: 'Fail',
            message: 'Manager ID not given.',
          },
        };
      }

      // Is user a manager of Organization?
      const isManager = organization.managerIds.includes(managerId);
      if (!isManager) {
        return {
          statusCode: 404,
          body: {
            status: 'Fail',
            message: 'Queried User is not Manager in Organization.',
          },
        };
      }

      // Check if user ID for manager exists
      if (!Meteor.users.findOne(managerId)) {
        return {
          statusCode: 404,
          body: {
            status: 'Fail',
            message: 'User exists but user data not found.',
          },
        };
      }

      // Do not include password in response
      const options = {};
      const excludeFields = {};
      excludeFields.services = 0;
      excludeFields.createdAt = 0;
      excludeFields.profile = 0;
      excludeFields.roles = 0;
      options.fields = excludeFields;

      return {
        statusCode: 200,
        body: {
          status: 'Organization manager contact information',
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
      // Organization doesn't exist
      if (!organization) {
        return {
          statusCode: 404,
          body: {
            status: 'Fail',
            message: 'Organization is not found with specified ID',
          },
        };
      }

      // Get ID of requesting User
      const requestorId = this.userId;

      const userCanManage = Meteor.call('userCanManageOrganization', requestorId, organization);
      // Requestor does not have permission for action
      if (!userCanManage) {
        // Organization exists but user can not manage
        return {
          statusCode: 403,
          body: {
            status: 'Fail',
            message: 'You do not have permission for editing this Organization',
          },
        };
      }

      // Get ID of new Manager
      const managerId = this.urlParams.managerId;
      // Manager ID was not given
      if (!managerId) {
        return {
          statusCode: 404,
          body: {
            status: 'Fail',
            message: 'Manager ID not given.',
          },
        };
      }

      // Is user a Manager in Organization?
      const alreadyManager = organization.managerIds.includes(managerId);
      if (!alreadyManager) {
        return {
          statusCode: 404,
          body: {
            status: 'Fail',
            message: 'Manager not found in Organization.',
          },
        };
      }

      // Remove user from organization manager list
      Meteor.call('removeOrganizationManager', organizationId, managerId);

      return {
        statusCode: 200,
        body: {
          status: 'Organization manager successfully removed',
          data: Organizations.findOne(organizationId),
        },
      };
    },
  },
});
