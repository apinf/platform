/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

// Collection imports
import ManagementV1 from '/apinf_packages/rest_apis/server/management';
import Organizations from '/apinf_packages/organizations/collection';

// APInf imports
/* eslint-disable max-len */
import descriptionOrganizations from '/apinf_packages/rest_apis/lib/descriptions/organizations_texts';
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
<<<<<<< HEAD
      description: descriptionOrganizations.get,
=======
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
>>>>>>> master
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

      // Create new Organization list that is based on Organization collection with extended field logoUrl
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
<<<<<<< HEAD
          data: organizationList,
=======
          data: Organizations.find(query, options).fetch(),
>>>>>>> master
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
<<<<<<< HEAD
      description: descriptionOrganizations.post,
=======
      description: `
   ### Adds a new Organization ###

   Admin user can add a new Organization into Catalog.

   Parameters:
   * *name* and *url* are mandatory parameters
   * *description* length must not exceed 1000 characters.

   On success, a response message with HTTP code 201 returns the created organization data.
      `,
>>>>>>> master
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
<<<<<<< HEAD
        return errorMessagePayload(400, 'Parameter "name" is erroneous or missing');
=======
        return {
          statusCode: 400,
          body: {
            status: 'fail',
            message: 'Parameter "name" is erroneous or missing',
          },
        };
>>>>>>> master
      }

      // Validate url
      isValid = Organizations.simpleSchema().namedContext().validateOne(
        organizationData, 'url');

      if (!isValid) {
<<<<<<< HEAD
        return errorMessagePayload(400, 'Parameter "url" is erroneous or missing');
=======
        return {
          statusCode: 400,
          body: {
            status: 'fail',
            message: 'Parameter "url" is erroneous or missing',
          },
        };
>>>>>>> master
      }

      // Validate description, if provided
      if (bodyParams.description) {
        isValid = Organizations.simpleSchema().namedContext().validateOne(
          organizationData, 'description');

        if (!isValid) {
<<<<<<< HEAD
          return errorMessagePayload(400, 'Parameter "description" is erroneous or too long');
=======
          return {
            statusCode: 400,
            body: {
              status: 'fail',
              message: 'Parameter "description" is erroneous or too long',
            },
          };
>>>>>>> master
        }
      }

      // Validate contact person name, if provided
      if (bodyParams.contact_name) {
        isValid = Organizations.simpleSchema().namedContext().validateOne(
          organizationData, 'contact.person');

        if (!isValid) {
<<<<<<< HEAD
          return errorMessagePayload(400, 'Parameter "contact_name" is erroneous');
=======
          return {
            statusCode: 400,
            body: {
              status: 'fail',
              message: 'Parameter "contact_name" is erroneous',
            },
          };
>>>>>>> master
        }
      }

      // Validate contact person phone, if provided
      if (bodyParams.contact_phone) {
        isValid = Organizations.simpleSchema().namedContext().validateOne(
          organizationData, 'contact.phone');

        if (!isValid) {
<<<<<<< HEAD
          return errorMessagePayload(400, 'Parameter "contact_phone" is erroneous');
=======
          return {
            statusCode: 400,
            body: {
              status: 'fail',
              message: 'Parameter "contact_phone" is erroneous',
            },
          };
>>>>>>> master
        }
      }

      // Validate contact person email, if provided
      if (bodyParams.contact_email) {
        isValid = Organizations.simpleSchema().namedContext().validateOne(
          organizationData, 'contact.email');

        if (!isValid) {
<<<<<<< HEAD
          return errorMessagePayload(400, 'Parameter "contact_email" is erroneous');
=======
          return {
            statusCode: 400,
            body: {
              status: 'fail',
              message: 'Parameter "contact_email" is erroneous',
            },
          };
>>>>>>> master
        }
      }

      // Validate facebook address, if provided
      if (bodyParams.facebook) {
        isValid = Organizations.simpleSchema().namedContext().validateOne(
          organizationData, 'socialMedia.facebook');

        if (!isValid) {
<<<<<<< HEAD
          return errorMessagePayload(400, 'Parameter "facebook" is erroneous');
=======
          return {
            statusCode: 400,
            body: {
              status: 'fail',
              message: 'Parameter "facebook" is erroneous',
            },
          };
>>>>>>> master
        }
      }

      // Validate instagram address, if provided
      if (bodyParams.instagram) {
        isValid = Organizations.simpleSchema().namedContext().validateOne(
          organizationData, 'socialMedia.instagram');

        if (!isValid) {
<<<<<<< HEAD
          return errorMessagePayload(400, 'Parameter "instagram" is erroneous');
=======
          return {
            statusCode: 400,
            body: {
              status: 'fail',
              message: 'Parameter "instagram" is erroneous',
            },
          };
>>>>>>> master
        }
      }

      // Validate twitter address, if provided
      if (bodyParams.twitter) {
        isValid = Organizations.simpleSchema().namedContext().validateOne(
          organizationData, 'socialMedia.twitter');

        if (!isValid) {
<<<<<<< HEAD
          return errorMessagePayload(400, 'Parameter "twitter" is erroneous');
=======
          return {
            statusCode: 400,
            body: {
              status: 'fail',
              message: 'Parameter "twitter" is erroneous',
            },
          };
>>>>>>> master
        }
      }

      // Validate linkedIn address, if provided
      if (bodyParams.linkedIn) {
        isValid = Organizations.simpleSchema().namedContext().validateOne(
          organizationData, 'socialMedia.linkedIn');

        if (!isValid) {
<<<<<<< HEAD
          return errorMessagePayload(400, 'Parameter "linkedIn" is erroneous');
=======
          return {
            statusCode: 400,
            body: {
              status: 'fail',
              message: 'Parameter "linkedIn" is erroneous',
            },
          };
>>>>>>> master
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
  // Response contains the entity with the given :id
  get: {
    authRequired: false,
    swagger: {
      tags: [
        ManagementV1.swagger.tags.organization,
      ],
      summary: 'Fetch Organization with specified ID.',
<<<<<<< HEAD
      description: descriptionOrganizations.getId,
=======
      description: `
   ### List the data of the Organization specified with ID ###

   Example call

    GET /organizations/:id

   Returns the data of the Organization specified with :id in case a match is found.

      `,
>>>>>>> master
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
<<<<<<< HEAD
        return errorMessagePayload(404, 'Organization with provided ID is not found');
=======
        return {
          statusCode: 404,
          body: {
            status: 'fail',
            message: 'Organization with provided ID is not found',
          },
        };
>>>>>>> master
      }

      const organization = Organizations.findOne(organizationId);

      /* Note! This one catches the case when user aims at
               organization/:id/managers
               but :id is missing. --> organization/managers
       */
      if (!organization) {
        const detailLine = `Organization with specified ID (${this.urlParams.id}) is not found`;
<<<<<<< HEAD
        return errorMessagePayload(404, detailLine);
      }

      // When internal logo id exists, add also correct link
      if (organization.organizationLogoFileId) {
        organization.logoURL = organization.logoUrl();
=======
        return {
          statusCode: 404,
          body: {
            status: 'fail',
            message: detailLine,
          },
        };
>>>>>>> master
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
<<<<<<< HEAD
      description: descriptionOrganizations.putId,
=======
      description: `
   ### Update an Organization ###

   Admin user or Organization manager can update Organization data with parameters listed below.

   Parameters
   * can be given one by one or several ones at a time
   * length of parameter *description* must not exceed 1000 characters

      `,
>>>>>>> master
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
<<<<<<< HEAD
        return errorMessagePayload(404, 'Organization with specified ID is not found');
=======
        return {
          statusCode: 404,
          body: {
            status: 'fail',
            message: 'Organization with specified ID is not found',
          },
        };
>>>>>>> master
      }
      // Get ID of User
      const userId = this.userId;
      const userCanManage = Meteor.call('userCanManageOrganization', userId, organization);

      // Make sure user has permission for action
      if (!userCanManage) {
        // Organization exists but user can not manage
<<<<<<< HEAD
        return errorMessagePayload(403, 'You do not have permission for editing this Organization');
=======
        return {
          statusCode: 403,
          body: {
            status: 'fail',
            message: 'You do not have permission for editing this Organization',
          },
        };
>>>>>>> master
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
<<<<<<< HEAD
          return errorMessagePayload(400, 'Parameter "name" is erroneous or missing');
=======
          return {
            statusCode: 400,
            body: {
              status: 'fail',
              message: 'Parameter "name" is erroneous or missing',
            },
          };
>>>>>>> master
        }
      }

      // Validate url, if provided
      if (bodyParams.url) {
        isValid = Organizations.simpleSchema().namedContext().validateOne(
          organizationData, 'url');

        if (!isValid) {
<<<<<<< HEAD
          return errorMessagePayload(400, 'Parameter "url" is erroneous or missing');
=======
          return {
            statusCode: 400,
            body: {
              status: 'fail',
              message: 'Parameter "url" is erroneous or missing',
            },
          };
>>>>>>> master
        }
      }

      // Validate description, if provided
      if (bodyParams.description) {
        isValid = Organizations.simpleSchema().namedContext().validateOne(
          organizationData, 'description');

        if (!isValid) {
<<<<<<< HEAD
          return errorMessagePayload(400, 'Parameter "description" is erroneous or too long');
=======
          return {
            statusCode: 400,
            body: {
              status: 'fail',
              message: 'Parameter "description" is erroneous or too long',
            },
          };
>>>>>>> master
        }
      }

      // Validate contact person name, if provided
      if (bodyParams.contact_name) {
        isValid = Organizations.simpleSchema().namedContext().validateOne(
          organizationData, 'contact.person');

        if (!isValid) {
<<<<<<< HEAD
          return errorMessagePayload(400, 'Parameter "contact_name" is erroneous');
=======
          return {
            statusCode: 400,
            body: {
              status: 'fail',
              message: 'Parameter "contact_name" is erroneous',
            },
          };
>>>>>>> master
        }
      }

      // Validate contact person phone, if provided
      if (bodyParams.contact_phone) {
        isValid = Organizations.simpleSchema().namedContext().validateOne(
          organizationData, 'contact.phone');

        if (!isValid) {
<<<<<<< HEAD
          return errorMessagePayload(400, 'Parameter "contact_phone" is erroneous');
=======
          return {
            statusCode: 400,
            body: {
              status: 'fail',
              message: 'Parameter "contact_phone" is erroneous',
            },
          };
>>>>>>> master
        }
      }

      // Validate contact person email, if provided
      if (bodyParams.contact_email) {
        isValid = Organizations.simpleSchema().namedContext().validateOne(
          organizationData, 'contact.email');

        if (!isValid) {
<<<<<<< HEAD
          return errorMessagePayload(400, 'Parameter "contact_email" is erroneous');
=======
          return {
            statusCode: 400,
            body: {
              status: 'fail',
              message: 'Parameter "contact_email" is erroneous',
            },
          };
>>>>>>> master
        }
      }

      // Validate facebook address, if provided
      if (bodyParams.facebook) {
        isValid = Organizations.simpleSchema().namedContext().validateOne(
          organizationData, 'socialMedia.facebook');

        if (!isValid) {
<<<<<<< HEAD
          return errorMessagePayload(400, 'Parameter "facebook" is erroneous');
=======
          return {
            statusCode: 400,
            body: {
              status: 'fail',
              message: 'Parameter "facebook" is erroneous',
            },
          };
>>>>>>> master
        }
      }

      // Validate instagram address, if provided
      if (bodyParams.instagram) {
        isValid = Organizations.simpleSchema().namedContext().validateOne(
          organizationData, 'socialMedia.instagram');

        if (!isValid) {
<<<<<<< HEAD
          return errorMessagePayload(400, 'Parameter "instagram" is erroneous');
=======
          return {
            statusCode: 400,
            body: {
              status: 'fail',
              message: 'Parameter "instagram" is erroneous',
            },
          };
>>>>>>> master
        }
      }

      // Validate twitter address, if provided
      if (bodyParams.twitter) {
        isValid = Organizations.simpleSchema().namedContext().validateOne(
          organizationData, 'socialMedia.twitter');

        if (!isValid) {
<<<<<<< HEAD
          return errorMessagePayload(400, 'Parameter "twitter" is erroneous');
=======
          return {
            statusCode: 400,
            body: {
              status: 'fail',
              message: 'Parameter "twitter" is erroneous',
            },
          };
>>>>>>> master
        }
      }

      // Validate linkedIn address, if provided
      if (bodyParams.linkedIn) {
        isValid = Organizations.simpleSchema().namedContext().validateOne(
          organizationData, 'socialMedia.linkedIn');

        if (!isValid) {
<<<<<<< HEAD
          return errorMessagePayload(400, 'Parameter "linkedIn" is erroneous');
=======
          return {
            statusCode: 400,
            body: {
              status: 'fail',
              message: 'Parameter "linkedIn" is erroneous',
            },
          };
>>>>>>> master
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
<<<<<<< HEAD
      description: descriptionOrganizations.deleteId,
=======
      description: `
   ### Deletes the identified Organization from catalog ###

   Admin user or Organization manager can remove Organization from Catalog.

   In successful case a response message with HTTP code 204 without any content is returned.
   Note! Trying to remove a non-existing Organization is considered a failed operation.

      `,
>>>>>>> master
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
<<<<<<< HEAD
        return errorMessagePayload(404, 'Organization with specified ID is not found');
=======
        return {
          statusCode: 404,
          body: {
            status: 'fail',
            message: 'Organization with specified ID is not found',
          },
        };
>>>>>>> master
      }
        // Get User ID
      const userId = this.userId;
      const userCanManage = Meteor.call('userCanManageOrganization', userId, organization);

      // User has to have permission for action
      if (!userCanManage) {
<<<<<<< HEAD
        return errorMessagePayload(403, 'You do not have permission for removing this Organization');
=======
        return {
          statusCode: 403,
          body: {
            status: 'fail',
            message: 'You do not have permission for removing this Organization',
          },
        };
>>>>>>> master
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
<<<<<<< HEAD
      description: descriptionOrganizations.getIdManagers,
=======
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
>>>>>>> master
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
<<<<<<< HEAD
        return errorMessagePayload(404, detailLine);
=======
        return {
          statusCode: 404,
          body: {
            status: 'fail',
            message: detailLine,
          },
        };
>>>>>>> master
      }

      // Get ID of requesting User
      const requestorId = this.userId;

      const userCanManage = Meteor.call('userCanManageOrganization', requestorId, organization);
      // Requestor must have permission for action
      if (!userCanManage) {
<<<<<<< HEAD
        return errorMessagePayload(403, 'You do not have permission for editing this Organization');
=======
        return {
          statusCode: 403,
          body: {
            status: 'fail',
            message: 'You do not have permission for editing this Organization',
          },
        };
>>>>>>> master
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
<<<<<<< HEAD
      description: descriptionOrganizations.postIdManagers,
=======
      description: `
   ### Adds a new Manager into Organization ###

   Admin user or Organization manager can add a new manager into organization.

   * Manager is identified with email address.
   * New manager must have a valid User account.
   * New manager must not already be a Manager in same Organization.

   On success, a complete list of Organization Managers is returned.
      `,
>>>>>>> master
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
<<<<<<< HEAD
        return errorMessagePayload(404, 'Organization with specified ID is not found');
=======
        return {
          statusCode: 404,
          body: {
            status: 'fail',
            message: 'Organization with specified ID is not found',
          },
        };
>>>>>>> master
      }

      // Get ID of requesting User
      const userId = this.userId;

      const userCanManage = Meteor.call('userCanManageOrganization', userId, organization);
      // Requestor does not have permission for action
      if (!userCanManage) {
        // Organization exists but user can not manage
<<<<<<< HEAD
        return errorMessagePayload(403, 'You do not have permission to edit this Organization');
=======
        return {
          statusCode: 403,
          body: {
            status: 'fail',
            message: 'You do not have permission to edit this Organization',
          },
        };
>>>>>>> master
      }

      // Check if manager list is given
      if (!bodyParams.newManagerEmail) {
<<<<<<< HEAD
        return errorMessagePayload(400, 'New Manager\'s email address is missing.');
=======
        return {
          statusCode: 400,
          body: {
            status: 'fail',
            message: 'New Manager\'s email address is missing.',
          },
        };
>>>>>>> master
      }

      // Get user account with matching email
      const newManager = Accounts.findUserByEmail(bodyParams.newManagerEmail);

      if (!newManager) {
<<<<<<< HEAD
        return errorMessagePayload(400, 'User has no account');
=======
        return {
          statusCode: 400,
          body: {
            status: 'fail',
            message: 'User has no account',
          },
        };
>>>>>>> master
      }

      // Check if user is already a manager
      const alreadyManager = organization.managerIds.includes(newManager._id);
      // Check if the user is already a manager
      if (alreadyManager) {
<<<<<<< HEAD
        return errorMessagePayload(400, 'User is already a Manager in this Organization');
=======
        return {
          statusCode: 400,
          body: {
            status: 'fail',
            message: 'User is already a Manager in this Organization',
          },
        };
>>>>>>> master
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

      if (!organization) {
        return errorMessagePayload(500, 'Could not get Organization from DB');
      }

      const managerUserAccountList = Meteor.users.find({ _id: { $in: organization.managerIds } }, options).fetch();

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
<<<<<<< HEAD
      description: descriptionOrganizations.getIdManagersManagerid,
=======
      description: `
   ### Inquiring Organization Manager's username and email address ###

   Admin user or Organization manager can fetch username and email address of a
   Manager identified by {managerId}.

   Example call:

    GET /organizations/<organizations id>/managers/<managers id>


      `,
>>>>>>> master
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
<<<<<<< HEAD
        return errorMessagePayload(400, 'Organization ID was not provided');
=======
        return {
          statusCode: 400,
          body: {
            status: 'fail',
            message: 'Organization ID was not provided',
          },
        };
>>>>>>> master
      }
      // Get ID of Organization from request parameter
      // Note! It can not be checked here, if this parameter is not provided,
      //       because in that case the parameters are shifted and endpoint is not found at all.
      const organizationId = this.urlParams.id;

      // Get Organization document
      const organization = Organizations.findOne(organizationId);
      // Organization must exist
      if (!organization) {
<<<<<<< HEAD
        return errorMessagePayload(404, 'Organization with specified ID is not found');
=======
        return {
          statusCode: 404,
          body: {
            status: 'fail',
            message: 'Organization with specified ID is not found',
          },
        };
>>>>>>> master
      }

      // Get ID of User requesting operation
      const requestorId = this.userId;

      const userCanManage = Meteor.call('userCanManageOrganization', requestorId, organization);
      // Requestor must have permissions for action
      if (!userCanManage) {
<<<<<<< HEAD
        return errorMessagePayload(403, 'You do not have permission for this Organization');
=======
        return {
          statusCode: 403,
          body: {
            status: 'fail',
            message: 'You do not have permission for this Organization',
          },
        };
>>>>>>> master
      }

      // Get ID of queried Manager from request parameter
      const managerId = this.urlParams.managerId;
      // Queried Manager ID must be given
      if (!managerId) {
<<<<<<< HEAD
        return errorMessagePayload(400, 'Manager ID was not provided.');
=======
        return {
          statusCode: 400,
          body: {
            status: 'fail',
            message: 'Manager ID was not provided.',
          },
        };
>>>>>>> master
      }

      // Check if user account for manager exists
      if (!Meteor.users.findOne(managerId)) {
<<<<<<< HEAD
        return errorMessagePayload(400, 'User has no User account.');
=======
        return {
          statusCode: 400,
          body: {
            status: 'fail',
            message: 'User has no User account.',
          },
        };
>>>>>>> master
      }

      // Is user a manager of Organization?
      const isManager = organization.managerIds.includes(managerId);
      if (!isManager) {
<<<<<<< HEAD
        return errorMessagePayload(400, 'Queried User is not a Manager in Organization.');
=======
        return {
          statusCode: 400,
          body: {
            status: 'fail',
            message: 'Queried User is not a Manager in Organization.',
          },
        };
>>>>>>> master
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
<<<<<<< HEAD
      description: descriptionOrganizations.deleteIdManagersManagerid,
=======
      description: `
   ### Deleting a User from Organization Manager list ###

   Admin user or Organization manager can delete managers from Organization manager list one by one.


   Example call:

    DELETE /organizations/<organizations id>/managers/<managers id>


   Note! Trying to remove a not existing Manager is considered a failed operation.
      `,
>>>>>>> master
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
<<<<<<< HEAD
        return errorMessagePayload(404, 'Organization with specified ID is not found');
=======
        return {
          statusCode: 404,
          body: {
            status: 'fail',
            message: 'Organization with specified ID is not found',
          },
        };
>>>>>>> master
      }

      // Get ID of requesting User
      const requestorId = this.userId;

      const userCanManage = Meteor.call('userCanManageOrganization', requestorId, organization);
      // Requestor must have permission for action
      if (!userCanManage) {
<<<<<<< HEAD
        return errorMessagePayload(403, 'You do not have permission for editing this Organization');
=======
        return {
          statusCode: 403,
          body: {
            status: 'fail',
            message: 'You do not have permission for editing this Organization',
          },
        };
>>>>>>> master
      }

      // Get ID of Manager to be removed
      const removeManagerId = this.urlParams.managerId;
      // Manager ID must be given
      if (!removeManagerId) {
<<<<<<< HEAD
        return errorMessagePayload(400, 'Missing parameter: Manager ID not provided.');
=======
        return {
          statusCode: 400,
          body: {
            status: 'fail',
            message: 'Missing parameter: Manager ID not provided.',
          },
        };
>>>>>>> master
      }

      // Admin/Manager is not allowed to remove self
      if (removeManagerId === requestorId) {
<<<<<<< HEAD
        return errorMessagePayload(403, 'User can not remove self.');
=======
        return {
          statusCode: 403,
          body: {
            status: 'fail',
            message: 'User can not remove self.',
          },
        };
>>>>>>> master
      }

      // Only existing Manager can be removed from Organization manager list
      const isManager = organization.managerIds.includes(removeManagerId);

      if (!isManager) {
<<<<<<< HEAD
        return errorMessagePayload(404, 'Manager not found in Organization.');
=======
        return {
          statusCode: 404,
          body: {
            status: 'fail',
            message: 'Manager not found in Organization.',
          },
        };
>>>>>>> master
      }

      // Remove user from organization manager list
      Meteor.call('removeOrganizationManager', organizationId, removeManagerId);

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
