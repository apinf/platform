// Meteor packages imports
import { Accounts } from 'meteor/accounts-base';
import { TAPi18n } from 'meteor/tap:i18n';

// APINF imports
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
