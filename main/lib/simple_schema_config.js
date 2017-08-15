/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { TAPi18n } from 'meteor/tap:i18n';

const invalidUrlMessage = TAPi18n.__('invalidUrlMessage');
const invalidIdMessage = TAPi18n.__('invalidIdMessage');
const invalidDomainMessage = TAPi18n.__('invalidDomainMessage');
const invalidEmailMessage = TAPi18n.__('invalidEmailMessage');

SimpleSchema.messages({
  regEx: [
    // TODO: define custom mesages for every RegEx
    { exp: SimpleSchema.RegEx.Url, msg: invalidUrlMessage },
    { exp: SimpleSchema.RegEx.Id, msg: invalidIdMessage },
    { exp: SimpleSchema.RegEx.Domain, msg: invalidDomainMessage },
    { exp: SimpleSchema.RegEx.Email, msg: invalidEmailMessage },
  ],
});
