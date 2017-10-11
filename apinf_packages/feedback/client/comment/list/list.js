/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Collection imports
import EntityComment from '/apinf_packages/entityComment/collection';

Template.feedbackCommentList.onCreated(function () {
  // Subscribe to comments for this feedback
  this.subscribe('getCommentForSingleFeedback', this.data.feedback._id);
});

Template.feedbackCommentList.helpers({
  userFeedbackComment () {
		// Return Comments for this feedback
    return EntityComment.find({
      postId: this.feedback._id,
    }, {
      sort: {
        createdAt: 1,
      },
    }).fetch();
  },
});
