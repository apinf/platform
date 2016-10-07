Template.apiAuthorizedUsersList.helpers({
  authorizedUsers () {
    // Get API document, reactively
    const api = Template.currentData().api;

    // Get all authorized users for current API
    const authorizedUsers = Meteor.users.find({ _id: {$in: api.authorizedUserIds } }).fetch();

    console.log(authorizedUsers);

    return authorizedUsers;
  }
});
