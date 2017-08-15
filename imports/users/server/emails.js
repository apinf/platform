/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Accounts } from 'meteor/accounts-base';
import { TAPi18n } from 'meteor/tap:i18n';

// APInf imports
import { getSiteTitle, getFromEmail } from '/core/helper_functions/mail_helpers';

Accounts.emailTemplates.siteName = getSiteTitle();

Accounts.emailTemplates.from = getFromEmail(true); // Get email in SMTP format

Accounts.emailTemplates.verifyEmail = {
  subject () {
    return TAPi18n.__('emailTemplates_verifyEmail_title');
  },
  text (user, url) {
      // Take out hash from url to use custom route behaviour
    const urlWithoutHash = url.replace('#/', '');
    const emailMessage = TAPi18n.__('emailTemplates_verifyEmail_message');
        // Construct emailBody
    const emailBody = `${emailMessage}\n\n${urlWithoutHash}`;

    return emailBody;
  },
};
