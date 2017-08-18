/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Collection imports
import Branding from '/apinf_packages/branding/collection';

Meteor.publish('branding', () => {
  // Get Branding collection object
  return Branding.find();
});
