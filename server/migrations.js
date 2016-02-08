Migrations.add({
  version: 1,
  name: 'Add manager role to all users that have APIs.',
  up: function() {
    let allManagerIds = [];
    let allApis = ApiBackends.find().fetch();
    // Iterate through allApis and push managerIds to allManagerIds array
    for(api in allApis) {
      allManagerIds.push.apply(allManagerIds, allApis[api].managerIds);
    }
    for(manager in allManagerIds) {
      // Add user to manager Role
      Roles.addUsersToRoles(allManagerIds[manager], ['manager']);
    }
  }
});
