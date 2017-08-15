/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { TAPi18n } from 'meteor/tap:i18n';

// APInf imports
import { proxyBasePathRegEx, apiBasePathRegEx } from '/packages/proxy_backends/collection/regex';

const invalidProxyBasePathMessage = TAPi18n.__('invalidProxyBasePathMessage');
const invalidApiBasePathMessage = TAPi18n.__('invalidApiBasePathMessage');


SimpleSchema.messages({
  regEx: [
    { exp: proxyBasePathRegEx, msg: invalidProxyBasePathMessage },
    { exp: apiBasePathRegEx, msg: invalidApiBasePathMessage },
  ],
});
