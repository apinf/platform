/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Mongo } from 'meteor/mongo';


const Organizations = new Mongo.Collection('Organizations');

// Default public fields
Organizations.publicFields = {
  _id: 1,
  createdAt: 1,
  contact: 1,
  description: 1,
  managerIds: 1,
  name: 1,
  organizationLogoFileId: 1,
  slug: 1,
};

export default Organizations;
