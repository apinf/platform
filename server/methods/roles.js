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
  }
});
