Template.favourite.created = function () {
  // Get reference to template instance
  var instance = this;

  // subscribe to user bookmarks, creating reference to subscription
  instance.bookmarksSubscription = instance.subscribe('myApiBookmarks');
};

Template.favourite.events({
  'click .bookmark': function () {

    //Store api id being clicked
    var backendId = this.apiBackend._id;

    //Store the user ID of the current user clicking the button
    var currentUserId = Meteor.userId();

    // Toggle (add/remove) the bookmark with method toogleBookmarkApi
    Meteor.call("toggleBookmarkApi", backendId, currentUserId);
  }
});

Template.favourite.helpers({
  isBookmarked: function () {

    // Get api backend Id from the context
    const apiBackendId = (this.apiBackend) ? this.apiBackend._id : this._id;

    // Get reference to template instance
    var instance = Template.instance();

    // Make sure bookmark subscription is ready
    if (instance.bookmarksSubscription.ready()) {

      // Get current user bookmark
      var userBookmarks = ApiBookmarks.findOne({ userId: Meteor.userId() });

      // Make sure user has bookmarks
      if (userBookmarks) {
        // get array of API IDs
        var apiIds = userBookmarks.apiIds;

        //Store api id being clicked
        var backendId = this.apiBackend._id;

        return true;
      }

      return false;
    }
  }
});
