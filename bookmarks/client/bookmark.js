import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { ApiBookmarks } from '/bookmarks/collection';

Template.apiBookmark.created = function () {
  // Get reference to template instance
  const instance = this;

  // subscribe to user API bookmarks
  instance.subscribe('userApiBookmarks');
};

Template.apiBookmark.events({
  'click .bookmark': function () {
    // Get api backend Id from the context
    const apiId = (this.api) ? this.api._id : this._id;

    // Store the user ID of the current user clicking the button
    const currentUserId = Meteor.user()._id;

    // Toggle (add/remove) the bookmark with method toogleBookmarkApi
    Meteor.call('toggleBookmarkApi', apiId, currentUserId);
  },
});

Template.apiBookmark.helpers({
  isBookmarked () {
    // Placeholder to see if API is bookmarked
    let isBookmarked;

    // Get reference to template instance
    const instance = Template.instance();

    // Get API ID from instance data context
    const apiId = instance.api._id;

    // Get current user bookmarks, only if this API is bookmarked
    const userBookmarks = ApiBookmarks.findOne({
      userId: Meteor.user()._id,
      apiIds: apiId,
    });

    // Check if user has bookmarked current API
    if (userBookmarks) {
      isBookmarked = true;
    } else {
      isBookmarked = false;
    }

    return isBookmarked;
  },
});
