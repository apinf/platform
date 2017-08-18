/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { TAPi18n } from 'meteor/tap:i18n';

// Fetch the profile username is taken message
const usernameIsTaken = TAPi18n.__('profile_usernameIsTaken');

// Configure SimpleSchema with username is taken message
SimpleSchema.messages({ usernameTaken: usernameIsTaken });
