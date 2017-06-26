/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

// Meteor contributed packages imports
import { Roles } from 'meteor/alanning:roles';

// Collection imports
import ApiV1 from '/core/server/api';
import Organizations from '/organizations/collection';

// Npm packages imports
import _ from 'lodash';


ApiV1.swagger.meta.paths['/users/{id}'].get = {
  tags: [
    ApiV1.swagger.tags.users,
  ],
  description: 'Returns user data with given ID.',
  parameters: [
    ApiV1.swagger.params.userId,
  ],
  responses: {
    200: {
      description: 'Data of identified user.',
    },
    401: {
      description: 'Authentication is required',
    },
    403: {
      description: 'User does not have permission.',
    },
    404: {
      description: 'No user found with given UserID.',
    },
  },
};

ApiV1.swagger.meta.paths['/users/{id}'].delete = {
  tags: [
    ApiV1.swagger.tags.users,
  ],
  description: 'Deletes the identified User.',
  parameters: [
    ApiV1.swagger.params.userId,
  ],
  responses: {
    200: {
      description: 'User deleted.',
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
      description: 'User not found',
    },
  },
  security: [
    {
      userSecurityToken: [],
      userId: [],
    },
  ],
};

// Generates: POST on /api/v1/users and GET, DELETE /api/v1/users/:id for
// Meteor.users collection
ApiV1.addCollection(Meteor.users, {
  excludedEndpoints: [],
  routeOptions: {
    authRequired: true,
  },
  endpoints: {
    getAll: {
      authRequired: true,
      swagger: {
        tags: [
          ApiV1.swagger.tags.users,
        ],
        description: 'Returns: For Admin: all users data. For non-admin: only own data.',
        parameters: [
          ApiV1.swagger.params.optionalSearch,
          ApiV1.swagger.params.organization_id,
          ApiV1.swagger.params.skip,
          ApiV1.swagger.params.limit,
          ApiV1.swagger.params.sort_by,
        ],
        responses: {
          200: {
            description: 'success',
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
        const excludeFields = {};
        let searchOnlyWithOwnId = false;
        // Get requestor's id
        const requestorId = this.userId;

        // Check if requestor is administrator
        const requestorHasRights = Roles.userIsInRole(requestorId, ['admin']);

        if (!requestorHasRights) {
          searchOnlyWithOwnId = true;
        }

        // parse query parameters
        if (searchOnlyWithOwnId) {
          query._id = requestorId;
        } else if (queryParams.organization_id) {
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
            queryParams.sort_by === 'username' ||
            _.includes(queryParams.sort_by, 'username')) {
          searchCondition.username = 1;
          options.sort = searchCondition;
        }

        if (queryParams.sort_by === 'created_at' ||
            _.includes(queryParams.sort_by, 'created_at')) {
          searchCondition.createdAt = 1;
          options.sort = searchCondition;
        }

        // This will be used when organization name is returned in first find
        // Needs also rethinking what to do in case there are several organizations
        if (queryParams.sort_by === 'organization' ||
            _.includes(queryParams.sort_by, 'organization')) {
          searchCondition.organizationName = 1;
          options.sort = searchCondition;
        }

        // This will be in use when timestamp for user update is taken in use
        if (queryParams.sort_by === 'updated_at' ||
            _.includes(queryParams.sort_by, 'updated_at')) {
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

        // Exclude password
        excludeFields.services = 0;
        options.fields = excludeFields;

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
                orgData.organizationId = organization._id;
                orgData.organizationName = organization.name;
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
      authRequired: true,
      action () {
      // Get requestor's id
        const requestorId = this.userId;

        const userIsGettingOwnAccount = this.urlParams.id === requestorId;

        const userIsAdmin = Roles.userIsInRole(requestorId, ['admin']);

        if (userIsGettingOwnAccount || userIsAdmin) {
          // Get ID of User to be fetched
          const userId = this.urlParams.id;

          // Exclude password
          const options = {};
          const excludeFields = {};

          excludeFields.services = 0;
          options.fields = excludeFields;

          // Check if user exists
          const user = Meteor.users.findOne(userId, options);
          if (user) {
            // Array for Organization name and id
            const orgDataList = [];
            // Get user id
            const userIdSearch = user._id;
            // Find all Organizations, where User belongs to
            const organizations = Organizations.find({
              managerIds: userIdSearch,
            }).fetch();
            // If there are Users' Organizations
            if (organizations.length > 0) {
              // Loop through Users' Organizations
              organizations.forEach((organization) => {
                const orgData = {};
                // Put Organization name and id into an object
                orgData.organizationId = organization._id;
                orgData.organizationName = organization.name;
                // Add this Organization data into Users' organization data list
                orgDataList.push(orgData);
              });
              // Add Organizations' information to Users' data
              user.organization = orgDataList;
            }
            // Construct response
            return {
              statusCode: 200,
              body: {
                status: 'success',
                data: user,
              },
            };
          }

          // User didn't exist
          return {
            statusCode: 404,
            body: {
              status: 'Fail',
              message: 'No user found with given UserID',
            },
          };
        }
        return {
          statusCode: 403,
          body: {
            status: 'Fail',
            message: 'User does not have permission',
          },
        };
      },

    },
    post: {
      authRequired: false,
      // roleRequired: ['admin'],
      swagger: {
        tags: [
          ApiV1.swagger.tags.users,
        ],
        description: 'Adds a new user. On success, returns newly added object.',
        parameters: [
          ApiV1.swagger.params.userName,
          ApiV1.swagger.params.email,
          ApiV1.swagger.params.password,
        ],
        responses: {
          201: {
            description: 'User successfully added',
          },
          400: {
            description: 'Invalid input, object invalid',
          },
          401: {
            description: 'Authentication is required',
          },
          409: {
            description: 'User already exists',
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
        const options = {};
        const excludeFields = {};

        // All parameters must be given
        if (!bodyParams.username ||
            !bodyParams.email ||
            !bodyParams.password) {
          return {
            statusCode: 400,
            body: {
              status: 'Bad request',
              message: 'Invalid input, object invalid',
            },
          };
        }

        // Does username already exist
        let userExists = Meteor.users.findOne({ username: bodyParams.username });

        if (!userExists) {
          // Is email address already in use
          userExists = Meteor.users.findOne({ 'emails.address': bodyParams.email });
        }

        // Either username or email is already in use
        if (userExists) {
          return {
            statusCode: 409,
            body: {
              status: 'Bad request',
              message: 'User already exists',
            },
          };
        }

        // Create a new user
        Accounts.createUser({
          username: bodyParams.username,
          email: bodyParams.email,
          password: bodyParams.password,
        });

        // Do not include password in response
        excludeFields.services = 0;
        options.fields = excludeFields;

        return {
          statusCode: 201,
          body: {
            status: 'Success',
            data: Meteor.users.findOne({ username: bodyParams.username }, options),
          },
        };
      },
    },

    // Delete a user
    delete: {
      authRequired: true,
      action () {
        // Get requestor's id
        const requestorId = this.userId;

        const userIsEditingOwnAccount = this.urlParams.id === requestorId;

        const userIsAdmin = Roles.userIsInRole(requestorId, ['admin']);

        if (userIsEditingOwnAccount || userIsAdmin) {
          // Get ID of User to be removed
          const userId = this.urlParams.id;
          // Check if user exists
          const user = Meteor.users.findOne(userId);
          if (user) {
            // Remove user from all Organizations
            Meteor.call('removeUserFromAllOrganizations', userId);

            // Remove existing User account
            Meteor.users.remove(user._id);

            return {
              statusCode: 200,
              body: {
                status: 'OK',
                message: 'User deleted',
              },
            };
          }

          // User didn't exist
          return {
            statusCode: 404,
            body: {
              status: 'Fail',
              message: 'No user found with given UserID',
            },
          };
        }
        return {
          statusCode: 403,
          body: {
            status: 'Fail',
            message: 'User does not have permission',
          },
        };
      },
    },
    // Udpdate user data
    put: {
      authRequired: true,
      swagger: {
        tags: [
          ApiV1.swagger.tags.users,
        ],
        description: 'Update a User',
        parameters: [
          ApiV1.swagger.params.userId,
          ApiV1.swagger.params.userName,
          ApiV1.swagger.params.company,
          ApiV1.swagger.params.password,
        ],
        responses: {
          200: {
            description: 'User successfully updated.',
          },
          401: {
            description: 'Authentication is required',
          },
          403: {
            description: 'User does not have permission',
          },
          404: {
            description: 'No user found with given UserID',
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
        // Get requestor's id
        const requestorId = this.userId;

        const userIsEditingOwnAccount = this.urlParams.id === requestorId;

        const userIsAdmin = Roles.userIsInRole(requestorId, ['admin']);

        // Return error in case requestor is neither admin nor editing own account
        if (!userIsEditingOwnAccount && !userIsAdmin) {
          return {
            statusCode: 403,
            body: {
              status: 'Fail',
              message: 'User does not have permission',
            },
          };
        }
        // Get ID of User
        const userId = this.urlParams.id;
        // Check if user to be modified exists
        const user = Meteor.users.findOne(userId);
        if (!user) {
          // User doesn't exist
          return {
            statusCode: 404,
            body: {
              status: 'Fail',
              message: 'No user found with given UserID',
            },
          };
        }

        // Get data from body parameters
        const bodyParams = this.bodyParams;
        let previousUsername;
        let previousPassword;
        let updateDone = false;

        // Are all parameters given
        if (!bodyParams.username &&
            !bodyParams.company &&
            !bodyParams.password) {
          return {
            statusCode: 400,
            body: {
              status: 'Bad request',
              message: 'Invalid input, object invalid',
            },
          };
        }

        // Check error situations before modification
        if (bodyParams.username) {
          // Check if there already is a User by the same name
          if (Accounts.findUserByUsername(bodyParams.username)) {
            return {
              statusCode: 403,
              body: {
                status: 'Failure',
                message: 'Username already exists',
              },
            };
          }
        }
        // Both old and new password has to be given
        if (bodyParams.password &&
            typeof bodyParams.password !== 'string') {
          return {
            statusCode: 400,
            body: {
              status: 'Erroneous new password',
            },
          };
        }

        // Try to change username
        if (bodyParams.username) {
          // Save old username for possible rollback
          previousUsername = user.username;
          // Update username
          Accounts.setUsername(userId, bodyParams.username);
          // Flag the change for response
          updateDone = true;
        }

        // Try to change password
        if (bodyParams.password) {
          // Save previous password in case restore is needed later
          previousPassword = user.services.password.bcrypt;
          Accounts.setPassword(userId, bodyParams.password);
          // Flag the change for response
          updateDone = true;
        }

        // Try to change company name
        if (bodyParams.company) {
          Meteor.users.update(userId, { $set: { 'profile.company': bodyParams.company } });
          // Flag the change for response
          updateDone = true;
        }

        // Successful update (one or more) is done
        if (updateDone) {
          return {
            statusCode: 200,
            body: {
              status: 'User successfully updated',
            },
          };
        }
        // Update failed
        if (previousUsername) {
          // Restore old username
          Accounts.setUsername(userId, previousUsername);
        }

        if (previousPassword) {
          Meteor.users.update(userId, { $set: { 'services.password.bcrypt': previousPassword } });
        }
        return {
          statusCode: 400,
          body: {
            status: 'User update failed!',
          },
        };
      },
    },
  },
});

// Request /rest/v1/users/updates for Users collection
ApiV1.addRoute('users/updates', {
  get: {
    roleRequired: ['admin'],
    swagger: {
      tags: [
        ApiV1.swagger.tags.users,
      ],
      description: 'Returns users',
      parameters: [
        ApiV1.swagger.params.since,
        ApiV1.swagger.params.organization_id,
        ApiV1.swagger.params.skip,
        ApiV1.swagger.params.limit,
      ],
      responses: {
        200: {
          description: 'success',
        },
        400: {
          description: 'Bad query parameters',
        },
      },
    },
    action () {
      let badQueryParameters = false;
      // Read possible query parameters
      const queryParams = this.queryParams;

      const query = {};
      const options = {};
      const excludeFields = {};

      // parse query parameters
      if (queryParams.organization_id) {
        // Get organization document with specified ID
        const organization = Organizations.findOne(queryParams.organization_id);

        // Make sure Organization exists
        if (organization) {
          // Get list of managed API IDs
          query._id = { $in: organization.managerIds };
        }
      } else {
        // Using organization ID other parameters are overridden
        if (queryParams.limit) {
          options.limit = parseInt(queryParams.limit, 10);
          if (options.limit < 1) {
            badQueryParameters = true;
          }
        } else {
          // By default 100 users is returned
          options.limit = 100;
        }

        if (queryParams.skip) {
          options.skip = parseInt(queryParams.skip, 10);
          if (options.skip < 0) {
            badQueryParameters = true;
          }
        }

        // Default value for parameter since is 7
        if (!queryParams.since) {
          queryParams.since = 7;
        }
        // Set the query for past days according to parameter since
        if (queryParams.since) {
          if (queryParams.since % 1 === 0) {
            query.createdAt = {
              $lt: new Date(),
              $gte: new Date(new Date().setDate(new Date().getDate() - queryParams.since)),
            };
          } else {
            badQueryParameters = true;
          }
        }
      }
      // Exclude password
      excludeFields.services = 0;
      options.fields = excludeFields;

      if (!badQueryParameters) {
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
                orgData.organizationId = organization._id;
                orgData.organizationName = organization.name;
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
      }
      // Construct response
      return {
        statusCode: 400,
        body: {
          status: 'Bad query parameters',
        },
      };
    },

  },
});
