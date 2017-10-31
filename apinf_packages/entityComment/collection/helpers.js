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
    // Return username
    return author && author.username;
  },
  postAuthor () {
    let userId;

    // If it is a reply of comment
    if (this.commentedOn) {
      // Get this comment instance
      const entityComment = EntityComment.findOne(this.commentedOn);
      // Get author ID of this comment
      userId = entityComment && entityComment.authorId;
    } else {
      // Otherwise it is a reply of feedback
      // Get this feedback instance
      const feedback = Feedback.findOne(this.postId);
      // Get author ID of this feedback
      userId = feedback && feedback.authorId;
    }

    // Fetch only the post Author's username for current feedback's comment
    const postAuthor = Meteor.users.findOne(userId);

    return postAuthor ? postAuthor.username : '';
  },
  currentUserCanReply () {
    // Get current userId
    const userId = Meteor.userId();

    // User can reply if he isn't author of entity
    return userId !== this.authorId;
  },
  currentUserCanEdit () {
    // Get current userId
    const userId = Meteor.userId();

    // User can Edit if he is author of entity
    return userId === this.authorId;
  },
  currentUserCanDelete () {
    // Fetch respective feedback
    const feedback = Feedback.findOne(this.postId);

    return feedback && feedback.currentUserCanChangeVisibility();
  },
});
