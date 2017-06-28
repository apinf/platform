/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

Meteor.methods({
  getClientDsn () {
    // Client side must have special public DSN which can be calculated from SENTRY_DSN

    // Get SENTRY_DNS from environment variables
    const DSN = process.env.SENTRY_DSN || '';
    // Get position ':'
    const twoSpot = DSN.lastIndexOf(':');
    // Get position '@'
    const sign = DSN.lastIndexOf('@');

    // Concat part before ':' and part after '@' including the sign
    const publicDsn = DSN.slice(0, twoSpot) + DSN.slice(sign, DSN.length);

    // Return public key for DSN or empty line
    return publicDsn;
  },
});
