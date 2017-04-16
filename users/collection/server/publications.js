/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// NPM packages imports
import _ from 'lodash';

Meteor.publish('managersUsernames', (apis) => {
  check(apis, Array);

  // Get all IDS of managers
  const allManagerIds = _.flatMap(apis, api => {
    return api.managerIds;
  });

  // Leave unique IDs without repeat
  const uniqueManagerIds = _.uniq(allManagerIds);

  return Meteor.users.find({ _id: { $in: uniqueManagerIds } }, { fields: { username: 1 } });
});
