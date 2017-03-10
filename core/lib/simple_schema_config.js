// Meteor packages imports
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

SimpleSchema.messages({
  regEx: [
    { exp: SimpleSchema.RegEx.Url, msg: '[label] must be a valid URL' },
    { exp: SimpleSchema.RegEx.Id, msg: '[label] must be a valid alphanumeric ID' },
    { exp: SimpleSchema.RegEx.Domain, msg: '[label] must be a valid domain' },
    { exp: SimpleSchema.RegEx.Email, msg: '[label] must be a valid e-mail address' },
  ],
});
