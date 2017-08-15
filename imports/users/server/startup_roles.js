/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Meteor contributed packages imports
import { Roles } from 'meteor/alanning:roles';

// Npm packages imports
import _ from 'lodash';

Meteor.startup(() => {
  // Make sure 'manager' role is defined

  // Get all roles
  const roles = Roles.getAllRoles().fetch();

  // Create an array of role names
  const roleNames = _.map(roles, (role) => { return role.name; });

  // Check if 'manager' role is defined
  const managerRoleIsDefined = _.includes(roleNames, 'manager');

  // If manager role is not defined
  if (!managerRoleIsDefined) {
    // Create the 'manager' role
    Roles.createRole('manager');
  }
});
