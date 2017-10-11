/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Collection imports
import Apis from '/apinf_packages/apis/collection';
import Feedback from '/apinf_packages/feedback/collection';
import EntityComment from './';

EntityComment.allow({
  insert (userId) {
    // Only allow logged in user to comment
    if (userId) {
      return true;
    }
    return false;
  },
  update (userId, entityComment) {
    // only allow user to update own comment
    if (userId && entityComment && entityComment.authorId &&
      userId === entityComment.authorId) {
      return true;
    }
    return false;
  },
  remove (userId, entityComment) {
    if (entityComment) {
      /* 1. Allow user to remove own comment */
      if (userId && entityComment.authorId &&
        userId === entityComment.authorId) {
        return true;
      }
      let api = {};
      switch (entityComment.type) {
        case 'Feedback': {
          /* 2. Allow admins & API owners/managers remove comments */
          // Get feedback by feedbackId of the feedback comment
          const feedback = Feedback.findOne(entityComment.postId);
          if (feedback) {
            // Get api by feedback apiBackendId
            api = Apis.findOne(feedback.apiBackendId);
          }
          break;
        }
        default: {
          break;
        }
      }
      // Return true/false based on edit permissions of api
      return (api && api.currentUserCanManage());
    }
    // Otherwise deny remove comment
    return false;
  },
});
