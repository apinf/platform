Template.favourite.created = function () {
  // Get reference to template instance
  const instance = this;

  // subscribe to user bookmarks, creating reference to subscription
  instance.bookmarksSubscription = instance.subscribe('myApiBookmarks');
};

Template.favourite.events({
  'click .bookmark': function () {
    // Get api backend Id from the context
    const apiId = (this.api) ? this.api._id : this._id;

    // Store the user ID of the current user clicking the button
    const currentUserId = Meteor.user()._id;

    // Toggle (add/remove) the bookmark with method toogleBookmarkApi
    Meteor.call('toggleBookmarkApi', apiId, currentUserId);
  },
});

Template.favourite.helpers({
  isBookmarked () {
    // Get api backend Id from the context
    const apiId = (this.api) ? this.api._id : this._id;

    // Get reference to template instance
    const instance = Template.instance();

    // Make sure bookmark subscription is ready
    if (instance.bookmarksSubscription.ready()) {
      // Get current user bookmark (should be only one API Bookmarks result available)
      const userBookmarks = ApiBookmarks.findOne({ userId: Meteor.user()._id, apiIds: apiId });

      // Make sure user has bookmarks
      if (userBookmarks) {
        return true;
      }

      return false;
    }
  },
});
