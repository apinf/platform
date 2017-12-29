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
    return !!(userId);
  },
  update (userId, entityComment) {
    // only allow user to update own comment
    const authorId = entityComment && entityComment.authorId;
    // Make sure user is logged and author of current entity
    return !!(userId && userId === authorId);
  },
  remove (userId, entityComment) {
    if (entityComment) {
      /* Allow admins & API owners/managers remove comments */
      const authorId = entityComment && entityComment.authorId;
      if (userId && userId === authorId) {
        return true;
      }
      let api;

      switch (entityComment.type) {
        case 'Feedback': {
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
