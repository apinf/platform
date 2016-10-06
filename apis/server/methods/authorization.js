Meteor.methods({
  addAuthorizedUserByEmail (apiId, email) {
    // Get user with matching email
    const user = Accounts.findUserByEmail(email);
  }
});
