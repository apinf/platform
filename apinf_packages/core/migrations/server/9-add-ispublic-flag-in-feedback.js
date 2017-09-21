/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor contributed packages imports
import { Migrations } from 'meteor/percolate:migrations';

// Collection imports
import Feedback from '/apinf_packages/feedback/collection';

Migrations.add({
  version: 9,
  name: 'Ensure that all feedbacks have the isPublic flag',
  up () {
    Feedback.update({ isPublic: { $exists: false } }, { $set: { isPublic: true } });
  },
});
