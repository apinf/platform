import { getSiteTitle, getFromEmail } from '/core/helper_functions/mail_helpers';

Accounts.emailTemplates.siteName = getSiteTitle();

Accounts.emailTemplates.from = getFromEmail();

Accounts.emailTemplates.verifyEmail = {
  subject() {
    return TAPi18n.__('emailTemplates_verifyEmail_title');
  },
  text( user, url ) {
    let emailAddress   = user.emails[0].address,
        // Take out hash from url to use custom route behaviour
        urlWithoutHash = url.replace( '#/', '' ),
        emailMessage = TAPi18n.__('emailTemplates_verifyEmail_message'),
        // Construct emailBody
        emailBody = `${emailMessage}\n\n${urlWithoutHash}`;

    return emailBody;
  }
};
