/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Collection imports
import Branding from '/apinf_packages/branding/collection';

// APInf imports
import Authentication from '/apinf_packages/rest_apis/server/authentication';
import BrandingV1 from '/apinf_packages/rest_apis/server/branding';
import errorMessagePayload from '/apinf_packages/rest_apis/server/rest_api_helpers';
import descriptionBranding from '/apinf_packages/rest_apis/lib/descriptions/branding_texts';
import { convertBodyParametersToBrandingData, validateProvidedApisIds } from './rest_api_helpers';

BrandingV1.swagger.meta.paths = {
  '/login': Authentication.login,
  '/logout': Authentication.logout,
};

BrandingV1.addRoute('branding', {
  // Response contains the Branding configuration
  get: {
    authRequired: true,
    // Admin role is required.
    roleRequired: ['admin'],
    swagger: {
      tags: [
        BrandingV1.swagger.tags.branding,
      ],
      summary: 'Branding settings',
      description: descriptionBranding.get,
      responses: {
        200: {
          description: 'Branding settings',
          schema: {
            type: 'object',
            properties: {
              status: {
                type: 'string',
                example: 'Success',
              },
              data: {
                $ref: '#/definitions/brandingResponse',
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
          description: 'Branding configuration is not found',
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
      // Get Branding configuration
      const branding = Branding.findOne();

      // make sure Branding configuration exists
      if (branding) {
        // Get URLs images of site logo & cover photo
        branding.siteLogoUrl = branding.siteLogoUrl();
        branding.coverPhotoUrl = branding.coverPhotoUrl();

        return {
          statusCode: 200,
          body: {
            status: 'success',
            data: branding,
          },
        };
      }

      // Otherwise Branding configuration doesn't exist
      return errorMessagePayload(404, 'No branding configuration exists');
    },
  },
  // Create a new Branding configuration
  post: {
    authRequired: true,
    // Admin role is required.
    roleRequired: ['admin'],
    swagger: {
      tags: [
        BrandingV1.swagger.tags.branding,
      ],
      summary: 'Add a Branding configuration',
      description: descriptionBranding.post,
      parameters: [
        BrandingV1.swagger.params.branding,
      ],
      responses: {
        201: {
          description: 'Branding added successfully',
          schema: {
            type: 'object',
            properties: {
              status: {
                type: 'string',
                example: 'Success',
              },
              data: {
                $ref: '#/definitions/brandingResponse',
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
      // Try to get Branding
      const branding = Branding.findOne();

      // Don't allow create a new one if it already exists
      if (branding) {
        const message = 'Branding configuration exists and there can be no more than one.';

        return errorMessagePayload(400, message);
      }

      // Convert data from body parameters to needed format
      const brandingData = convertBodyParametersToBrandingData(this.bodyParams);

      // Check that provided APIs IDs link to existing public APIs
      const errorMessage = validateProvidedApisIds(brandingData.featuredApis);

      // If the function returns error message, return error and error message text
      if (errorMessage) {
        return errorMessagePayload(400, errorMessage);
      }

      // Validate general cases:
      // Social media urls are URL format
      // overlayTransparency field is number
      // Fields with String type are string
      try {
        Branding.schema.validate(brandingData);
      } catch (e) {
        // Return error and message text
        return errorMessagePayload(400, e.reason, 'parameter', e.details);
      }

      // Insert Branding data into collection
      const brandingId = Branding.insert(brandingData);

      // Did insert fail
      if (!brandingId) {
        return errorMessagePayload(500, 'Inserting Branding into database failed.');
      }

      return {
        statusCode: 201,
        body: {
          status: 'success',
          data: Branding.findOne(brandingId),
        },
      };
    },
  },
  // Modify the Branding configuration
  put: {
    authRequired: true,
    // Admin role is required.
    roleRequired: ['admin'],
    swagger: {
      tags: [
        BrandingV1.swagger.tags.branding,
      ],
      summary: 'Update branding.',
      description: descriptionBranding.put,
      parameters: [
        BrandingV1.swagger.params.branding,
      ],
      responses: {
        200: {
          description: 'Branding configuration updated successfully',
          schema: {
            type: 'object',
            properties: {
              status: {
                type: 'string',
                example: 'Success',
              },
              data: {
                $ref: '#/definitions/brandingResponse',
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
          description: 'Branding configuration is not found',
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
      const branding = Branding.findOne();

      // branding doesn't exist
      if (!branding) {
        return errorMessagePayload(404, 'Branding configuration is not found.');
      }

      // Convert data from body parameters to needed format
      const brandingData = convertBodyParametersToBrandingData(this.bodyParams, branding);

      // Check that provided APIs IDs link to existed public API
      const errorMessage = validateProvidedApisIds(brandingData.featuredApis);

      // If the function returns error message, return error and error message text
      if (errorMessage) {
        return errorMessagePayload(400, errorMessage);
      }

      // General validation covers cases:
      // Social media urls are URL format
      // overlayTransparency field is number
      // Fields with String type are string
      try {
        Branding.schema.validate(brandingData);
      } catch (e) {
        // Return error and message text
        return errorMessagePayload(400, e.reason, 'parameter', e.details);
      }

      // Update Branding document
      Branding.update({}, { $set: brandingData });

      // OK response with Branding data
      return {
        statusCode: 200,
        body: {
          status: 'success',
          data: Branding.findOne(),
        },
      };
    },
  },
  // Remove the Branding configuration
  delete: {
    authRequired: true,
    // Admin role is required.
    roleRequired: ['admin'],
    swagger: {
      tags: [
        BrandingV1.swagger.tags.branding,
      ],
      summary: 'Delete branding.',
      description: descriptionBranding.delete,
      responses: {
        204: {
          description: 'Branding removed successfully',
        },
        401: {
          description: 'Authentication is required',
        },
        403: {
          description: 'User does not have permission',
        },
        404: {
          description: 'Branding configuration is not found',
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
      // Get Branding document
      const branding = Branding.findOne();

      // Branding must exist
      if (!branding) {
        // Branding doesn't exist
        return errorMessagePayload(404, 'Branding configuration is not found.');
      }

      // Remove Branding document
      Branding.remove({});

      // No content with 204
      return {
        statusCode: 204,
        body: {
          status: 'success',
          message: 'Branding removed',
        },
      };
    },
  },
});
