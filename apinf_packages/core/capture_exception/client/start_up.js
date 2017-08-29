/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Npm packages imports
import Raven from 'raven-js';

// APInf imports
import wrapMeteorDebug from './wrap_meteor_debug';

Meteor.startup(() => {
  Meteor.call('getClientDsn', (err, result) => {
    // The falsy result will turn off the Sentry app
    const SENTRY_DSN = result || false;

    // Configure Raven capture tracking for Client side
    Raven
      .config(SENTRY_DSN)
      .install();
  });

  wrapMeteorDebug();
});
