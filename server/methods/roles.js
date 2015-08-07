Meteor.methods({
  "createAdminRoleIfNotDefined": function () {
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
      console.log('Defining "admin" role.');
      Roles.createRole('admin');
    }
  }
});
