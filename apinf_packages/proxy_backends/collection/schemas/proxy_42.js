/* Copyright 2019 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { TAPi18n } from 'meteor/tap:i18n';

// Collection imports
import Settings from '/apinf_packages/settings/collection';

// APInf imports
import {
  proxyBasePathRegEx,
  apiBasePathRegEx } from '../regex';

const Proxy42Schema = new SimpleSchema({
  id: {
    type: String,
    optional: true,
  },
  name: {
    type: String,
    optional: true,
  },
});

SimpleSchema.messages({
  invalidProxyBackendForm_forbiddenPrefixMessage:
    TAPi18n.__('invalidProxyBackendForm_forbiddenPrefixMessage'),
  invalidProxyBackendForm_headerStringMessage:
    TAPi18n.__('invalidProxyBackendForm_headerStringMessage'),
});
// Internationalize API Umbrella schema texts
Proxy42Schema.i18n('schemas.proxyBackends.apiUmbrella');

export default Proxy42Schema;
