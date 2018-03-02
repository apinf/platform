/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

 // Fill and return error response message body
export default function errorMessagePayload (statusCode, messageText, additionalKey, additionalValue) {
  // Fill payload
  const errorPayload = {
    statusCode,
    body: {
      status: 'fail',
      message: messageText,
    },
  };
  // When an additional information is needed to be included in response
  if (additionalKey) {
    errorPayload.body[additionalKey] = additionalValue;
  }
  return errorPayload;
}