/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Meteor contributed packages imports
import { Restivus } from 'meteor/nimble:restivus';

const UsersAPIV1 = new Restivus({
  apiPath: 'api',
  version: 'v1',
  defaultHeaders: {
    'Content-Type': 'application/json',
  },
  useDefaultAuth: false,
  prettyJson: true,
  enableCors: true,
});


UsersAPIV1.addCollection(Meteor.users);

// Generates: POST on /api/users and GET, DELETE /api/users/:id for
// Meteor.users collection
UsersAPIV1.addCollection(Meteor.users, {
  excludedEndpoints: ['getAll', 'put'],
  routeOptions: {
    authRequired: false,
  },
  endpoints: {
    post: {
      authRequired: true,
    },
    delete: {
      roleRequired: 'admin',
    },
  },
});
// Maps to: /api/v1/users
UsersAPIV1.addRoute('users', { authRequired: false }, {
  get () {
    return Meteor.users.find({});
  },
});
