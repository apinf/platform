/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Mongo } from 'meteor/mongo';

// Create Mongo collection for LoginPlatforms module.
const LoginPlatforms = new Mongo.Collection('LoginPlatforms');

// Export the collection
export default LoginPlatforms;
