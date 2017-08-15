/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Npm packages imports
import Raven from 'raven';

// APInf imports
import wrapMethods from './wrap_meteor_methods';

Meteor.startup(() => {
  // Get Sentry DNS from environment variable or set false
  // Falsy value turns off the Sentry app
  const SENTRY_DSN = process.env.SENTRY_DSN || false;

  // Configure Raven capture tracking for Server side
  Raven.config(SENTRY_DSN,
    {
      // Capture unhandled promise rejections
      captureUnhandledRejections: true,
    }).install();

  wrapMethods();
});
