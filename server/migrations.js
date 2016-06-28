import { ApiBackends } from '/apis/collection/backend';

Migrations.add({
  version: 1,
  name: 'Add manager role to all users that have APIs.',
  up: function() {
    let allApis = ApiBackends.find().fetch();
    // Create array of all managerIds
    let managerIds = allApis.map(function (api) {
      return api.managerIds;
    });
    // Flatten the nested array
    managerIds = _.flatten(managerIds);

    managerIds.forEach(function (managerId) {
      // Check that managerId is not null
      if (managerId) {
        // Add user to manager Role
        Roles.addUsersToRoles(managerId, 'manager');
      }
    });
  }
});
