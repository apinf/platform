/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// Collection imports
import EntityComment from '/apinf_packages/entityComment/collection';

Meteor.publish('commentUsersUsername', (entityIds) => {
  check(entityIds, Array);

  // Get IDs of comment authors
  const authorIds = EntityComment.find({ postId: { $in: entityIds } })
    .map((entity) => {
      return entity.authorId;
    });

  return Meteor.users.find({ _id: { $in: authorIds } }, { username: 1 });
});

Meteor.publish('getEntitiesComments', (entityIds) => {
  check(entityIds, Array);

  // Return comments for specified entities
  return EntityComment.find({ postId: { $in: entityIds } });
});
