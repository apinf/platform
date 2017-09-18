/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { TAPi18n } from 'meteor/tap:i18n';

// APInf imports
import {
  apiBasePathRegEx,
  proxyBasePathRegEx,
} from '/apinf_packages/proxy_backends/collection/regex';
import contactPhone from '/apinf_packages/organizations/collection/regex';

const invalidUrlMessage = TAPi18n.__('invalidUrlMessage');
const invalidIdMessage = TAPi18n.__('invalidIdMessage');
const invalidDomainMessage = TAPi18n.__('invalidDomainMessage');
const invalidEmailMessage = TAPi18n.__('invalidEmailMessage');
const invalidProxyBasePathMessage = TAPi18n.__('invalidProxyBasePathMessage');
const invalidApiBasePathMessage = TAPi18n.__('invalidApiBasePathMessage');
const invalidContactPhoneMessage = TAPi18n.__('invalidContactPhoneMessage');

SimpleSchema.messages({
  regEx: [
    // TODO: define custom mesages for every RegEx
    { exp: SimpleSchema.RegEx.Url, msg: invalidUrlMessage },
    { exp: SimpleSchema.RegEx.Id, msg: invalidIdMessage },
    { exp: SimpleSchema.RegEx.Domain, msg: invalidDomainMessage },
    { exp: SimpleSchema.RegEx.Email, msg: invalidEmailMessage },
    { exp: proxyBasePathRegEx, msg: invalidProxyBasePathMessage },
    { exp: apiBasePathRegEx, msg: invalidApiBasePathMessage },
    { exp: contactPhone, msg: invalidContactPhoneMessage },
  ],
});
