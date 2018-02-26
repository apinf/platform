/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

// Collection imports
import Organizations from '/apinf_packages/organizations/collection';

// APInf imports
/* eslint-disable max-len */
import descriptionOrganizations from '/apinf_packages/rest_apis/lib/descriptions/organizations_texts';
/* eslint-enable max-len */
import ManagementV1 from '/apinf_packages/rest_apis/server/management';
import errorMessagePayload from '/apinf_packages/rest_apis/server/rest_api_helpers';

// Request /rest/v1/organizations for Organizations collection
ManagementV1.addRoute('organizations', {
  // Response contains a list of organizations
  get: {
    swagger: {
      tags: [
        ManagementV1.swagger.tags.organization,
      ],
      summary: 'List and search organizations.',
      description: descriptionOrganizations.get,
      parameters: [
        ManagementV1.swagger.params.optionalSearch,
        ManagementV1.swagger.params.skip,
        ManagementV1.swagger.params.limit,
      ],
      responses: {
        200: {
          description: 'List of organizations',
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
          description: 'Bad Request. Erroneous or missing parameter.',
        },
      },
    },
    action () {
      const queryParams = this.queryParams;

      // Create placeholders
      const query = {};
      const options = {};

      if (queryParams.limit) {
        // Parse query parameters
        const limit = parseInt(queryParams.limit, 10);

        // Make sure limit parameters only accept integer
        if (!Number.isInteger(limit)) {
          return errorMessagePayload(400,
            'Bad query parameters value. Limit parameters only accept integer.');
        }
        options.limit = limit;
      }

      if (queryParams.skip) {
        // Parse query parameters
        const skip = parseInt(queryParams.skip, 10);

        // Make sure skip parameters only accept integer
        if (!Number.isInteger(skip)) {
          return errorMessagePayload(400,
            'Bad query parameters value. Skip parameters only accept integer.');
        }
        options.skip = skip;
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

      // Return list of Organizations.
      // Extend an Organization data field logoUrl, when Organization has a logo.
      const organizationList = Organizations.find(query, options).map((organization) => {
        // Make sure logo is uploaded
        if (organization.organizationLogoFileId) {
          // Create a new field to store logo URL
          organization.logoUrl = organization.logoUrl();
        }
        return organization;
      });

      // Construct response
      return {
        statusCode: 200,
        body: {
          status: 'success',
          data: organizationList,
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
      description: descriptionOrganizations.post,
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
          description: 'Bad Request. Erroneous or missing parameter.',
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
          linkedIn: bodyParams.linkedIn,
        },
      };

      // Validate name
      let isValid = Organizations.simpleSchema().namedContext().validateOne(
        organizationData, 'name');

      if (!isValid) {
        return errorMessagePayload(400, 'Parameter "name" is erroneous or missing');
      }

      // Organization with same name must not already exist
      const duplicateOrganization = Organizations.findOne({ name: bodyParams.name });

      if (duplicateOrganization) {
        const detailLine = 'Duplicate: Organization with same name exists.';
        const idValue = `${duplicateOrganization._id}`;
        return errorMessagePayload(400, detailLine, 'id', idValue);
      }

      // Validate url
      isValid = Organizations.simpleSchema().namedContext().validateOne(
        organizationData, 'url');

      if (!isValid) {
        return errorMessagePayload(400, 'Parameter "url" is erroneous or missing');
      }

      // Validate description, if provided
      if (bodyParams.description) {
        isValid = Organizations.simpleSchema().namedContext().validateOne(
          organizationData, 'description');

        if (!isValid) {
          return errorMessagePayload(400, 'Parameter "description" is erroneous or too long');
        }
      }

      // Validate contact person name, if provided
      if (bodyParams.contact_name) {
        isValid = Organizations.simpleSchema().namedContext().validateOne(
          organizationData, 'contact.person');

        if (!isValid) {
          return errorMessagePayload(400, 'Parameter "contact_name" is erroneous');
        }
      }

      // Validate contact person phone, if provided
      if (bodyParams.contact_phone) {
        isValid = Organizations.simpleSchema().namedContext().validateOne(
          organizationData, 'contact.phone');

        if (!isValid) {
          return errorMessagePayload(400, 'Parameter "contact_phone" is erroneous');
        }
      }

      // Validate contact person email, if provided
      if (bodyParams.contact_email) {
        isValid = Organizations.simpleSchema().namedContext().validateOne(
          organizationData, 'contact.email');

        if (!isValid) {
          return errorMessagePayload(400, 'Parameter "contact_email" is erroneous');
        }
      }

      // Validate facebook address, if provided
      if (bodyParams.facebook) {
        isValid = Organizations.simpleSchema().namedContext().validateOne(
          organizationData, 'socialMedia.facebook');

        if (!isValid) {
          return errorMessagePayload(400, 'Parameter "facebook" is erroneous');
        }
      }

      // Validate instagram address, if provided
      if (bodyParams.instagram) {
        isValid = Organizations.simpleSchema().namedContext().validateOne(
          organizationData, 'socialMedia.instagram');

        if (!isValid) {
          return errorMessagePayload(400, 'Parameter "instagram" is erroneous');
        }
      }

      // Validate twitter address, if provided
      if (bodyParams.twitter) {
        isValid = Organizations.simpleSchema().namedContext().validateOne(
          organizationData, 'socialMedia.twitter');

        if (!isValid) {
          return errorMessagePayload(400, 'Parameter "twitter" is erroneous');
        }
      }

      // Validate linkedIn address, if provided
      if (bodyParams.linkedIn) {
        isValid = Organizations.simpleSchema().namedContext().validateOne(
          organizationData, 'socialMedia.linkedIn');

        if (!isValid) {
          return errorMessagePayload(400, 'Parameter "linkedIn" is erroneous');
        }
      }

      // Get Formed slug
      const slugData = Meteor.call('formSlugFromName', 'Organizations', bodyParams.name);

      // If formed slug true
      if (slugData && typeof slugData === 'object') {
        // Include slug
        organizationData.slug = slugData.slug;
        // Include friendlySlugs
        organizationData.friendlySlugs = slugData.friendlySlugs;
      }

      // Insert query
      const organizationId = Organizations.insert(organizationData);

      // If insert failed, stop and send response
      if (!organizationId) {
        return errorMessagePayload(500, 'Insert organization failed. Organization not created!');
      }

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
  // Response contains the entity with the given :id
  get: {
    authRequired: false,
    swagger: {
      tags: [
        ManagementV1.swagger.tags.organization,
      ],
      summary: 'Fetch Organization with specified ID.',
      description: descriptionOrganizations.getId,
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
          description: 'Organization is not found',
        },
      },
    },
    action () {
      const organizationId = this.urlParams.id;
      if (!organizationId) {
        return errorMessagePayload(404, 'Organization with provided ID is not found');
      }

      const organization = Organizations.findOne(organizationId);

      /* Note! This one catches the case when user aims at
               organization/:id/managers
               but :id is missing. --> organization/managers
       */
      if (!organization) {
        const detailLine = `Organization with specified ID (${this.urlParams.id}) is not found`;
        return errorMessagePayload(404, detailLine);
      }

      // When internal logo id exists, add also correct link
      if (organization.organizationLogoFileId) {
        organization.logoURL = organization.logoUrl();
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
      description: descriptionOrganizations.putId,
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
          description: 'Bad Request. Erroneous or missing parameter.',
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
      // Get ID of Organization
      const organizationId = this.urlParams.id;
      // Get Organization document
      const organization = Organizations.findOne(organizationId);
      // Check if Organization exists
      if (!organization) {
        // Organization doesn't exist
        return errorMessagePayload(404, 'Organization with specified ID is not found');
      }
      // Get ID of User
      const userId = this.userId;
      const userCanManage = Meteor.call('userCanManageOrganization', userId, organization);

      // Make sure user has permission for action
      if (!userCanManage) {
        // Organization exists but user can not manage
        return errorMessagePayload(403, 'You do not have permission for editing this Organization');
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

      let isValid;
      // Validate name, if provided
      if (bodyParams.name) {
        isValid = Organizations.simpleSchema().namedContext().validateOne(
          organizationData, 'name');

        if (!isValid) {
          return errorMessagePayload(400, 'Parameter "name" is erroneous or missing');
        }
        // Organization with same name must not already exist
        const duplicateOrganization = Organizations.findOne({ name: bodyParams.name });

        if (duplicateOrganization) {
          const detailLine = 'Duplicate: Organization with same name exists.';
          const idValue = `${duplicateOrganization._id}`;
          return errorMessagePayload(400, detailLine, 'id', idValue);
        }
      }

      // Validate url, if provided
      if (bodyParams.url) {
        isValid = Organizations.simpleSchema().namedContext().validateOne(
          organizationData, 'url');

        if (!isValid) {
          return errorMessagePayload(400, 'Parameter "url" is erroneous or missing');
        }
      }

      // Validate description, if provided
      if (bodyParams.description) {
        isValid = Organizations.simpleSchema().namedContext().validateOne(
          organizationData, 'description');

        if (!isValid) {
          return errorMessagePayload(400, 'Parameter "description" is erroneous or too long');
        }
      }

      // Validate contact person name, if provided
      if (bodyParams.contact_name) {
        isValid = Organizations.simpleSchema().namedContext().validateOne(
          organizationData, 'contact.person');

        if (!isValid) {
          return errorMessagePayload(400, 'Parameter "contact_name" is erroneous');
        }
      }

      // Validate contact person phone, if provided
      if (bodyParams.contact_phone) {
        isValid = Organizations.simpleSchema().namedContext().validateOne(
          organizationData, 'contact.phone');

        if (!isValid) {
          return errorMessagePayload(400, 'Parameter "contact_phone" is erroneous');
        }
      }

      // Validate contact person email, if provided
      if (bodyParams.contact_email) {
        isValid = Organizations.simpleSchema().namedContext().validateOne(
          organizationData, 'contact.email');

        if (!isValid) {
          return errorMessagePayload(400, 'Parameter "contact_email" is erroneous');
        }
      }

      // Validate facebook address, if provided
      if (bodyParams.facebook) {
        isValid = Organizations.simpleSchema().namedContext().validateOne(
          organizationData, 'socialMedia.facebook');

        if (!isValid) {
          return errorMessagePayload(400, 'Parameter "facebook" is erroneous');
        }
      }

      // Validate instagram address, if provided
      if (bodyParams.instagram) {
        isValid = Organizations.simpleSchema().namedContext().validateOne(
          organizationData, 'socialMedia.instagram');

        if (!isValid) {
          return errorMessagePayload(400, 'Parameter "instagram" is erroneous');
        }
      }

      // Validate twitter address, if provided
      if (bodyParams.twitter) {
        isValid = Organizations.simpleSchema().namedContext().validateOne(
          organizationData, 'socialMedia.twitter');

        if (!isValid) {
          return errorMessagePayload(400, 'Parameter "twitter" is erroneous');
        }
      }

      // Validate linkedIn address, if provided
      if (bodyParams.linkedIn) {
        isValid = Organizations.simpleSchema().namedContext().validateOne(
          organizationData, 'socialMedia.linkedIn');

        if (!isValid) {
          return errorMessagePayload(400, 'Parameter "linkedIn" is erroneous');
        }
      }

      // If Organization name given
      if (bodyParams.name) {
        // Get Formed slug
        const slugData = Meteor.call('formSlugFromName', 'Organizations', bodyParams.name);
        // Check slugData
        if (slugData && typeof slugData === 'object') {
          // Include slug
          organizationData.slug = slugData.slug;
          // Include friendlySlugs
          organizationData.friendlySlugs = slugData.friendlySlugs;
        }
      }
      // Update Organization document
      const result = Organizations.update(organizationId, { $set: organizationData });

      // Check if organization update failed
      if (result === 0) {
        return errorMessagePayload(500, 'Organization update failed');
      }

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
      description: descriptionOrganizations.deleteId,
      parameters: [
        ManagementV1.swagger.params.organizationId,
      ],
      responses: {
        204: {
          description: 'Organization removed successfully.',
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
      // Get ID of Organization
      const organizationId = this.urlParams.id;

      // Get organization document
      const organization = Organizations.findOne(organizationId);

      // Make sure Organization exists
      if (!organization) {
        // Organization doesn't exist
        return errorMessagePayload(404, 'Organization with specified ID is not found');
      }
        // Get User ID
      const userId = this.userId;
      const userCanManage = Meteor.call('userCanManageOrganization', userId, organization);

      // User has to have permission for action
      if (!userCanManage) {
        return errorMessagePayload(403, 'No permission to removing this Organization');
      }

      // Remove Organization document
      const result = Meteor.call('removeOrganization', organization._id);

      if (result === 0) {
        return errorMessagePayload(500, 'Organization removing failed.');
      }

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
      description: descriptionOrganizations.getIdManagers,
      parameters: [
        ManagementV1.swagger.params.organizationId,
      ],
      responses: {
        200: {
          description: 'List of organization\'s managers',
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
          description: 'Organization is not found',
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
        return errorMessagePayload(404, detailLine);
      }

      // Get ID of requesting User
      const requestorId = this.userId;

      const userCanManage = Meteor.call('userCanManageOrganization', requestorId, organization);
      // Requestor must have permission for action
      if (!userCanManage) {
        return errorMessagePayload(403, 'You do not have permission for editing this Organization');
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
      description: descriptionOrganizations.postIdManagers,
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
          description: 'Bad Request. Erroneous or missing parameter.',
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
          description: 'Organization is not found',
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
        return errorMessagePayload(404, 'Organization with specified ID is not found');
      }

      // Get ID of requesting User
      const userId = this.userId;

      const userCanManage = Meteor.call('userCanManageOrganization', userId, organization);
      // Requestor does not have permission for action
      if (!userCanManage) {
        // Organization exists but user can not manage
        return errorMessagePayload(403, 'You do not have permission to edit this Organization');
      }

      // Check if manager list is given
      if (!bodyParams.newManagerEmail) {
        return errorMessagePayload(400, 'New Manager\'s email address is missing.');
      }

      // Get user account with matching email
      const newManager = Accounts.findUserByEmail(bodyParams.newManagerEmail);

      if (!newManager) {
        return errorMessagePayload(400, 'User has no account');
      }

      // Check if user is already a manager
      const alreadyManager = organization.managerIds.includes(newManager._id);
      // Check if the user is already a manager
      if (alreadyManager) {
        return errorMessagePayload(400, 'User is already a Manager in this Organization');
      }

      // Update Organization manager list
      const result = Organizations.update(organizationId,
        { $push: { managerIds: newManager._id } });

      // If organization update failed
      if (result === 0) {
        return errorMessagePayload(500, 'Organization manager update failed');
      }

      // Do not include password in response
      const options = {};
      const includeFields = {};
      includeFields._id = 1;
      includeFields.username = 1;
      includeFields.emails = 1;
      options.fields = includeFields;

      // Get Organization document after managerIds update
      organization = Organizations.findOne(organizationId);

      if (!organization) {
        return errorMessagePayload(500, 'Could not get Organization from DB');
      }

      const managerUserAccountList = Meteor.users.find({
        _id: { $in: organization.managerIds } }, options).fetch();

      if (!managerUserAccountList) {
        return errorMessagePayload(500, 'Could not get Organization Manager\'s data from DB');
      }

      return {
        statusCode: 200,
        body: {
          status: 'success',
          managerIds: organization.managerIds,
          data: managerUserAccountList,
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
      description: descriptionOrganizations.getIdManagersManagerid,
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
          description: 'Bad Request. Erroneous or missing parameter.',
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
          description: 'Organization is not found',
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
        return errorMessagePayload(400, 'Organization ID was not provided');
      }
      // Get ID of Organization from request parameter
      // Note! It can not be checked here, if this parameter is not provided,
      //       because in that case the parameters are shifted and endpoint is not found at all.
      const organizationId = this.urlParams.id;

      // Get Organization document
      const organization = Organizations.findOne(organizationId);
      // Organization must exist
      if (!organization) {
        return errorMessagePayload(404, 'Organization with specified ID is not found');
      }

      // Get ID of User requesting operation
      const requestorId = this.userId;

      const userCanManage = Meteor.call('userCanManageOrganization', requestorId, organization);
      // Requestor must have permissions for action
      if (!userCanManage) {
        return errorMessagePayload(403, 'You do not have permission for this Organization');
      }

      // Get ID of queried Manager from request parameter
      const managerId = this.urlParams.managerId;
      // Queried Manager ID must be given
      if (!managerId) {
        return errorMessagePayload(400, 'Manager ID was not provided.');
      }

      // Check if user account for manager exists
      if (!Meteor.users.findOne(managerId)) {
        return errorMessagePayload(400, 'User has no User account.');
      }

      // Is user a manager of Organization?
      const isManager = organization.managerIds.includes(managerId);
      if (!isManager) {
        return errorMessagePayload(400, 'Queried User is not a Manager in Organization.');
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
      description: descriptionOrganizations.deleteIdManagersManagerid,
      parameters: [
        ManagementV1.swagger.params.organizationId,
        ManagementV1.swagger.params.managerId,
      ],
      responses: {
        204: {
          description: 'Organization Manager removed successfully.',
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
          description: 'Bad Request. Erroneous or missing parameter.',
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
      // Get ID of Organization
      const organizationId = this.urlParams.id;
      // Note! It can not be checked here, if this parameter is not provided,
      //       because in that case the parameters are shifted and endpoint is not found at all.

      // Get Organization document
      const organization = Organizations.findOne(organizationId);
      // Organization must exist
      if (!organization) {
        return errorMessagePayload(404, 'Organization with specified ID is not found');
      }

      // Get ID of requesting User
      const requestorId = this.userId;

      const userCanManage = Meteor.call('userCanManageOrganization', requestorId, organization);
      // Requestor must have permission for action
      if (!userCanManage) {
        return errorMessagePayload(403, 'You do not have permission for editing this Organization');
      }

      // Get ID of Manager to be removed
      const removeManagerId = this.urlParams.managerId;
      // Manager ID must be given
      if (!removeManagerId) {
        return errorMessagePayload(400, 'Missing parameter: Manager ID not provided.');
      }

      // Admin/Manager is not allowed to remove self
      if (removeManagerId === requestorId) {
        return errorMessagePayload(403, 'User can not remove self.');
      }

      // Only existing Manager can be removed from Organization manager list
      const isManager = organization.managerIds.includes(removeManagerId);

      if (!isManager) {
        return errorMessagePayload(404, 'Manager not found in Organization.');
      }

      // Remove user from organization manager list
      const result = Meteor.call('removeOrganizationManager', organizationId, removeManagerId);

      if (result === 0) {
        return errorMessagePayload(500, 'Removing manager id from organization failed.');
      }

      return {
        statusCode: 204,
        body: {
          status: 'success',
          message: 'Manager removed successfully.',
        },
      };
    },
  },
});
