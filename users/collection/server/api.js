/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

// Collection imports
import ApiV1 from '/core/server/api';
import Organizations from '/organizations/collection';

  // Generates: POST on /api/v1/users and GET, DELETE /api/v1/users/:id for
  // Meteor.users collection
ApiV1.addCollection(Meteor.users, {
  excludedEndpoints: ['put'],
  routeOptions: {
    authRequired: true,
  },
  endpoints: {
    getAll: {
      swagger: {
        description: 'Returns users',
        parameters: [
          ApiV1.swagger.params.optionalSearch,
          ApiV1.swagger.params.organization_id,
          ApiV1.swagger.params.skip,
          ApiV1.swagger.params.limit,
          ApiV1.swagger.params.sort_by,
        ],
        responses: {
          200: {
            description: 'users',
          },
          400: {
            description: 'Bad query parameters',
          },
        },
      },
      action () {
        const queryParams = this.queryParams;

        const query = {};
        const options = {};
        const searchCondition = {};

        // parse query parameters
        if (queryParams.organization_id) {
          // Get organization document with specified ID
          const organization = Organizations.findOne(queryParams.organization_id);

          // Make sure Organization exists
          if (organization) {
            // Get list of managed API IDs
            query._id = { $in: organization.managerIds };
          }
        }

        if (queryParams.limit) {
          options.limit = parseInt(queryParams.limit, 10);
        } else {
          // By default 100 users is returned
          options.limit = 100;
        }

        if (queryParams.skip) {
          options.skip = parseInt(queryParams.skip, 10);
        }

        // By default users are sorted by username
        if (!queryParams.sort_by ||
            queryParams.sort_by === 'username') {
          searchCondition.username = 1;
          options.sort = searchCondition;
        }

        if (queryParams.sort_by === 'created_at') {
          searchCondition.createdAt = 1;
          options.sort = searchCondition;
        }

        if (queryParams.sort_by === 'updated_at') {
          searchCondition.updatedAt = 1;
          options.sort = searchCondition;
        }

        // Pass an optional search string for looking up inventory.
        if (queryParams.q) {
          query.$or = [
            {
              username: {
                $regex: queryParams.q,
                $options: 'i', // case-insensitive option
              },
            },
            {
              'profile.company': {
                $regex: queryParams.q,
                $options: 'i', // case-insensitive option
              },
            },
            {
              'emails.address': {
                $regex: queryParams.q,
                $options: 'i', // case-insensitive option
              },
            },
          ];
        }
        // Get all users
        const userList = Meteor.users.find(query, options).fetch();
        // Get Organization names and ids for every User
        if (userList) {
          // Loop through user list one by one
          userList.forEach((userData) => {
            // Array for Organization name and id
            const orgDataList = [];
            // Get user id
            const userId = userData._id;
            // Find all Organizations, where User belongs to
            const organizations = Organizations.find({
              managerIds: userId,
            }).fetch();
            // If there are Users' Organizations
            if (organizations.length > 0) {
              // Loop through Users' Organizations
              organizations.forEach((organization) => {
                const orgData = {};
                // Put Organization name and id into an object
                orgData.organization_id = organization._id;
                orgData.organization_name = organization.name;
                // Add this Organization data into Users' organization data list
                orgDataList.push(orgData);
              });
              // Add Organizations' information to Users' data
              userData.organization = orgDataList;
            }
          });
        }
        // Construct response
        return {
          statusCode: 200,
          body: {
            status: 'success',
            data: userList,
          },
        };
      },

    },
    get: {
      swagger: {
        description: 'Returns user with given ID.',
        parameters: [
          ApiV1.swagger.params.userId,
        ],
        responses: {
          200: {
            description: 'One user.',
          },
        },
      },
    },
    post: {
      authRequired: true,
      roleRequired: ['admin'],
      swagger: {
        tags: [
          ApiV1.swagger.tags.user,
        ],
        description: 'Adds a new user. On success, returns newly added object.',
        parameters: [
          ApiV1.swagger.params.user,
        ],
        responses: {
          200: {
            description: 'User successfully added',
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
        console.log('param=', bodyParams);
        //
        // const userId = Meteor.users.insert(userData);

        Accounts.createUser({
          username: bodyParams.username,
          email: bodyParams.email,
          password: bodyParams.password,
        });

        return {
          status: 'Success',
          data: Meteor.users.findOne({ username: bodyParams.username }),
        };
      },
    },

    delete: {
      roleRequired: 'admin',
      swagger: {
        description: 'Delete user.',
        responses: {
          200: {
            description: 'Successful delete.',
          },
        },
      },
    },
  },
});

// Request /rest/v1/users/:id for Users collection
ApiV1.addRoute('Meteor.users/:id', {
  // Modify the entity with the given :id with the data contained in the request body.
  // put: {
  //   authRequired: true,
  //   swagger: {
  //     tags: [
  //       ApiV1.swagger.tags.user,
  //     ],
  //     description: 'Update a User',
  //     parameters: [
  //       ApiV1.swagger.params.userId,
  //       ApiV1.swagger.params.user,
  //     ],
  //     responses: {
  //       200: {
  //         description: 'User successfully edited.',
  //       },
  //       401: {
  //         description: 'Authentication is required',
  //       },
  //       403: {
  //         description: 'User does not have permission',
  //       },
  //       404: {
  //         description: 'User is not found',
  //       },
  //     },
  //     security: [
  //       {
  //         userSecurityToken: [],
  //         userId: [],
  //       },
  //     ],
  //   },
  //   action () {
  //     // Get ID of User
  //     const userId = this.urlParams.id;
  //     // Get Organization document
  //     const organization = Organizations.findOne(organizationId);
  //
  //     if (organization) {
  //       // Get ID of User
  //       const userId = this.userId;
  //       const userCanManage = Meteor.call('userCanManageOrganization', userId, organization);
  //
  //       // Make sure user has permission for action
  //       if (userCanManage) {
  //         // Get data from body parameters
  //         const bodyParams = this.bodyParams;
  //
  //         // If bodyParams doesn't contain any fields
  //         // then organizationData JSON doesn't contain it as well
  //         const organizationData = {
  //           name: bodyParams.name,
  //           url: bodyParams.url,
  //           description: bodyParams.description,
  //
  //           contact: {
  //             person: bodyParams.contact_name,
  //             phone: bodyParams.contact_phone,
  //             email: bodyParams.contact_email,
  //           },
  //           socialMedia: {
  //             facebook: bodyParams.facebook,
  //             instagram: bodyParams.instagram,
  //             twitter: bodyParams.twitter,
  //             linkedIn: bodyParams.linkedin,
  //           },
  //         };
  //
  //         // Update Organization document
  //         Organizations.update(organizationId, { $set: organizationData });
  //
  //         return {
  //           statusCode: 200,
  //           body: {
  //             status: 'Success updating',
  //             data: Organizations.findOne(organizationId),
  //           },
  //         };
  //       }
  //
  //       // Organization exists but user can not manage
  //       return {
  //         statusCode: 403,
  //         body: {
  //           status: 'Fail',
  //           message: 'You do not have permission for editing this Organization',
  //         },
  //       };
  //     }
  //
  //     // Organization doesn't exist
  //     return {
  //       statusCode: 404,
  //       body: {
  //         status: 'Fail',
  //         message: 'Organization is not found with specified ID',
  //       },
  //     };
  //   },
  // },
  // Delete a user
  delete: {
    authRequired: true,
    swagger: {
      tags: [
        ApiV1.swagger.tags.user,
      ],
      description: 'Deletes the identified Organization from catalog.',
      parameters: [
        ApiV1.swagger.params.userId,
      ],
      responses: {
        200: {
          description: 'User successfully removed.',
        },
        400: {
          description: 'Invalid input, invalid object',
        },
        401: {
          description: 'Authentication is required',
        },
        403: {
          description: 'User does not have permission',
        },
        404: {
          description: 'User is not found',
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
      const userId = this.urlParams.id;
      const user = Meteor.users.findOne(userId).fetch();

      if (user) {
        // Remove User account
        Meteor.call('deleteAccount', userId);

        return {
          statusCode: 200,
          body: {
            status: 'User successfully removed',
          },
        };
      }

      // User doesn't exist
      return {
        statusCode: 404,
        body: {
          status: 'Fail',
          message: 'User is not found with specified ID',
        },
      };
    },
  },
});
