/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Npm packages imports
import _ from 'lodash';

// The structure "requiredFields" describes proxy types and list of required fields for this proxy
// Key is proxy_type
// Value is list of required fields
const requiredFieldsForProxy = {
  emqtt: ['proxyUrl', 'apiUrl', 'adminUsername', 'adminPassword', 'elasticsearch'],
  apiUmbrella: ['url', 'apiKey', 'authToken', 'elasticsearch'],
  proxy42: ['url'],
};

export default function validateSchema (proxyType, proxyFields) {
  // Find required fields for current proxy type
  const requiredFields = requiredFieldsForProxy[proxyType];

  // If unknown proxy type then show error
  if (requiredFields === undefined) {
    throw new Error(`Not implemented schema validation for "${proxyType}" type`);
  }

  // Check all fields in schema for filling
  return _.reduce(requiredFields, (result, field) => {
    return result && !!proxyFields[field];
  }, true);
}
