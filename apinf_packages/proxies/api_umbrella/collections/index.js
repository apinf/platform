/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Mongo } from 'meteor/mongo';


const ApiUmbrellaAdmins = new Mongo.Collection('apiUmbrellaAdmins');
const ApiUmbrellaUsers = new Mongo.Collection('apiUmbrellaUsers');

export { ApiUmbrellaAdmins, ApiUmbrellaUsers };
