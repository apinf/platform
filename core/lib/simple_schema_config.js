// Meteor packages imports
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

// APINF imports
import { proxyBasePathRegEx, apiBasePathRegEx } from '/proxy_backends/collection/regex';
import { contactPhone } from '/organizations/collection/regex';

SimpleSchema.messages({
  regEx: [
    // TODO: define custom mesages for every RegEx
    { exp: SimpleSchema.RegEx.Url, msg: '[label] must be a valid URL' },
    { exp: SimpleSchema.RegEx.Id, msg: '[label] must be a valid alphanumeric ID' },
    { exp: SimpleSchema.RegEx.Domain, msg: '[label] must be a valid domain' },
    { exp: SimpleSchema.RegEx.Email, msg: '[label] must be a valid e-mail address' },
    { exp: proxyBasePathRegEx, msg: '[label] allowed characters: A-Z' },
    { exp: apiBasePathRegEx, msg: '[label] allowed characters: A-Z' },
    { exp: contactPhone, msg: '[label] allowed characters: A-Z' },
  ],
});
