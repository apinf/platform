/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Npm packages imports
import Raven from 'raven-js';

export default function wrapMeteorDebug () {
  // Expand Meteor._debug function - capture and log exception to Sentry before display error
  const originalMeteorDebug = Meteor._debug;

  Meteor._debug = function (m, s) {
    // Exception message contains two message.
    // One of them is Exception Tracker which is not useful for debugging
    // Don't send exception to Sentry which is related to Tracker exception
    if (m !== 'Exception from Tracker recompute function:') {
      // Provide message of error and stack
      Raven.captureException(m, { extra: { stack: s } });
    }
    // eslint-disable-next-line
    return originalMeteorDebug.apply(this, arguments);
  };
};
