/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

// Collection imports
import ApiBookmarks from '/apinf_packages/bookmarks/collection';

import '/apinf_packages/bookmarks/client/bookmark.html';

Template.bookmark.onCreated(function () {
  // Get reference to template instance
  const instance = this;

  // subscribe to user bookmarks, creating reference to subscription
  instance.bookmarksSubscription = instance.subscribe('userApiBookmarks');
});

Template.bookmark.events({
  'click .bookmark': function () {
    // Get api backend Id from the context
    const apiId = (this.api) ? this.api._id : this._id;

    // Store the user ID of the current user clicking the button
    const currentUserId = Meteor.user()._id;

    // Toggle (add/remove) the bookmark with method toogleBookmarkApi
    Meteor.call('toggleBookmarkApi', apiId, currentUserId);
  },
});

Template.bookmark.helpers({
  isBookmarked () {
    // Get api backend Id from the context
    const apiId = (this.api) ? this.api._id : this._id;

    // Get reference to template instance
    const instance = Template.instance();

    let userBookmark;
    // Make sure bookmark subscription is ready
    if (instance.bookmarksSubscription.ready()) {
      // Get current user bookmark (should be only one API Bookmarks result available)
      userBookmark = ApiBookmarks.findOne({ userId: Meteor.user()._id, apiIds: apiId });
    }
    // Return true if user has an API bookmark
    return !!(userBookmark);
  },
});
