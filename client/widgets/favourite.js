Template.favourite.events({
  'click .bookmark': function () {

    //Store api id being clicked
    var backendId = this._id;

    //Store the user ID of the current user clicking the button
    var currentUserId = Meteor.user()._id;

    // Creating the bookmark with method bookmarkApi
    Meteor.call("bookmarkApi", backendId, currentUserId);
  }
});
