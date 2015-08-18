Meteor.methods({
  "createAdminRoleIfNotDefined": function (adminRole) {
    // TODO: Refactor this process to allow user to specify  admin role as parameter
    // E.g. a config page where the user can input the desired string

    // Define the admin role
    var adminRole = 'admin';

    // Placceholder variable for admin check
    var adminIsDefined;

    // Get all existing roles
    var roles = Roles.getAllRoles().fetch();

    // Flatten the roles to an array of role names
    var rolesArray = _.map(roles, function (role) {
      // Return the name of the role
      return role.name;
    });

    // Check if admin role is defined in Roles collection
    adminIsDefined = _.contains(rolesArray, adminRole);

    // Create the admin role if it is not already defined
    if (!adminIsDefined) {
      console.log('Defining "' + adminRole + '" role.');
      Roles.createRole(adminRole);
    }
  },
  'addFirstUserToAdminRole': function (userId) {
    // Look for existing users and set initial user as admin if none exist
    Meteor.call('countUsers', function(error, userCount) {
      // If there is only one user
      if (userCount === 1) {
        // Get the user's roles
        var userRoles = Roles.getRolesForUser(userId);

        // Define the admin role
        var adminRole = 'admin';

        // Check if current user is admin
        var userIsAdmin = _.contains(userRoles, adminRole);

        // If user is not admin
        if (!userIsAdmin) {
          // Add user to admin role
          Roles.addUsersToRoles(userId, ['admin']);
          console.log("Added initial user as admin:", userId);
        } else {
          console.log("User already has admin role.")
        }
      }
    });
  }
});
