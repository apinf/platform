/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Collection imports
import ProjectLogo from '/apinf_packages/branding/logo/collection';

Meteor.publish('projectLogo', () => {
  return ProjectLogo.find({
    'metadata._Resumable': {
      $exists: false,
    },
  });
});
