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
  apiRequiredHeaderRegEx,
  proxyBasePathRegEx,
  appendQueryStringRegEx,
} from '/apinf_packages/proxy_backends/collection/regex';
import {
  apiMonitoringEndpointRegEx,
  apiEndPointRegEx,
} from '/apinf_packages/monitoring/collection/lib/regex';
import contactPhone from '/apinf_packages/organizations/collection/regex';

const invalidApiBasePathMessage = TAPi18n.__('invalidApiBasePathMessage');
const invalidApiEndpointMessage = TAPi18n.__('invalidApiEndpointMessage');
const invalidApiMonitoringEndpointMessage = TAPi18n.__('invalidApiMonitoringEndpointMessage');
const invalidApiRequiredMessage = TAPi18n.__('invalidApiRequiredMessage');
const invalidAppendQueryStringMessage = TAPi18n.__('invalidAppendQueryStringMessage');
const invalidContactPhoneMessage = TAPi18n.__('invalidContactPhoneMessage');
const invalidDomainMessage = TAPi18n.__('invalidDomainMessage');
const invalidEmailMessage = TAPi18n.__('invalidEmailMessage');
const invalidIdMessage = TAPi18n.__('invalidIdMessage');
const invalidProxyBasePathMessage = TAPi18n.__('invalidProxyBasePathMessage');
const invalidUrlMessage = TAPi18n.__('invalidUrlMessage');

SimpleSchema.messages({
  regEx: [
    // TODO: define custom messages for every RegEx
    { exp: SimpleSchema.RegEx.Url, msg: invalidUrlMessage },
    { exp: SimpleSchema.RegEx.Id, msg: invalidIdMessage },
    { exp: SimpleSchema.RegEx.Domain, msg: invalidDomainMessage },
    { exp: SimpleSchema.RegEx.Email, msg: invalidEmailMessage },
    { exp: appendQueryStringRegEx, msg: invalidAppendQueryStringMessage },
    { exp: proxyBasePathRegEx, msg: invalidProxyBasePathMessage },
    { exp: apiBasePathRegEx, msg: invalidApiBasePathMessage },
    { exp: apiRequiredHeaderRegEx, msg: invalidApiRequiredMessage },
    { exp: contactPhone, msg: invalidContactPhoneMessage },
    { exp: apiEndPointRegEx, msg: invalidApiEndpointMessage },
    { exp: apiMonitoringEndpointRegEx, msg: invalidApiMonitoringEndpointMessage },
  ],
});
