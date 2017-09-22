/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

 // Fill and return error response message body
 function errorMessagePayload (statusCode, messageText) {
   // Get branding
   const errorPayload = {
     statusCode,
     body: {
       status: 'fail',
       message: messageText,
     },
   };
   return errorPayload;
 }

 export default errorMessagePayload;
