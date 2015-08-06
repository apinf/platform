Meteor.methods({
  "createAdminRoleIfNotDefined": function () {
    // Define the admin role
    var adminRole = 'admin';

    // Get all existing roles
    var roles = Roles.getAllRoles().fetch();

    // Placceholder variable for admin check
    var adminIsDefined;
    
    // Check if admin role is defined in Roles collection
    _.each(roles, function (role) {
      // Check if role is admin
      if (role.name === 'admin') {
        // Indicate that admin has been defined
        adminIsDefined = true;
      }
    })

    // Create the admin role if it is not already defined
    if (!adminIsDefined) {
      //Roles.createRole('admin');
      console.log('admin is not defined');
      console.log(Roles.getAllRoles().fetch());
    }
  }
});
