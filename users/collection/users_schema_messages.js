// Meteor packages imports
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { TAPi18n } from 'meteor/tap:i18n';

// Fetch the profile username is taken message
const usernameIsTaken = TAPi18n.__('profile_usernameIsTaken');

// Configure SimpleSchema with username is taken message
SimpleSchema.messages({ usernameTaken: usernameIsTaken });
