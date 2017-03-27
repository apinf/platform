/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Collection imports
import Apis from '../';

// Create indexes for fields in MongoDB collection (API backends search functionality)
// TODO: shouldn't it be during Meteor.startup?
//       ref: http://joshowens.me/how-to-optimize-your-mongo-database-for-meteor-js/
// eslint-disable-next-line no-underscore-dangle
Apis._ensureIndex({
  name: 1,
  backend_host: 1,
});
