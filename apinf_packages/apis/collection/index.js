/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Mongo } from 'meteor/mongo';

const Apis = new Mongo.Collection('apis');

// Default public fields
Apis.publicFields = {
  _id: 1,
  apiLogoFileId: 1,
  authorizedUserIds: 1,
  averageRating: 1,
  bookmarkCount: 1,
  created_at: 1,
  description: 1,
  isPublic: 1,
  lifecycleStatus: 1,
  managerIds: 1,
  name: 1,
  slug: 1,
  url: 1,
};

export default Apis;
