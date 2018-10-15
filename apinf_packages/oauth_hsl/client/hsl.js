/* Copyright 2018 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

Accounts.oauth.registerService('hsl');

Meteor.loginWithHsl = function (options, callback) {
  // support a callback without options
  if (!callback && typeof options === 'function') {
    callback = options;
    options = null;
  }

  const credentialRequestCompleteCallback =
    Accounts.oauth.credentialRequestCompleteHandler(callback);
  Hsl.requestCredential(options, credentialRequestCompleteCallback);
};
