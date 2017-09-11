import { Migrations } from 'meteor/percolate:migrations';

import Feedback from '/apinf_packages/feedback/collection';

Migrations.add({
  version: 9,
  name: 'Ensure that all feedbacks have the isPublic flag',
  up () {
    Feedback.update({}, { $set: { isPublic: true } });
  },
});
