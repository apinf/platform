/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Collection imports
import Feedback from '/apinf_packages/feedback/collection';
import EntityComment from './';

EntityComment.helpers({
  author () {
    // Fetch only the author's username for current comment/feedback
    const author = Meteor.users.findOne(this.authorId);
    return author.username;
  },
  postAuthor () {
    let userId = '';
    if (this.commentedOn) {
      const entityComment = EntityComment.findOne(this.commentedOn);
      if (entityComment) {
        userId = entityComment.authorId;
      }
    } else {
      const feedback = Feedback.findOne(this.postId);
      if (feedback) {
        userId = feedback.authorId;
      }
    }
    if (userId) {
      // Fetch only the post Author's username for current feedback's comment
      const postAuthor = Meteor.users.findOne(userId);

      return postAuthor.username;
    }
    return false;
  },
  currentUserCanReply () {
    // Get current userId
    const userId = Meteor.userId();

    return !!(userId !== this.authorId);
  },
  currentUserCanEdit () {
    // Get current userId
    const userId = Meteor.userId();
    return !!(userId === this.authorId);
  },
  currentUserCanDelete () {
    // Fetch respective feedback
    const feedback = Feedback.findOne(this.postId);

    return feedback && feedback.currentUserCanChangeVisibility();
  },
});
