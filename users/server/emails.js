import { Branding } from '/branding/collection';
import { Settings } from '/settings/collection';

Accounts.emailTemplates.siteName = function () {
  // Get branding
  const branding = Branding.findOne();

  // Check branding exists
  if( branding ) {
    return branding.siteTitle;
  }
};
Accounts.emailTemplates.from = function () {
  // Get settings
  const Settings = Settings.findOne();

  // Check settings exists
  if( settings ) {
    // Check if siteName is defined
    if( Accounts.emailTemplates.siteName ) {
      // Construct from email (eg. Apinf "<info@apinf.io>")
     const fromEmail = Accounts.emailTemplates.siteName +
       ' <' + settings.mail.fromEmail + '>';
    } else {
      // Construct from email (eg. "info@apinf.io")
     const fromEmail = settings.mail.fromEmail;
    }

    return fromEmail;
  }
};

Accounts.emailTemplates.verifyEmail = {
  subject() {
    const siteName = Accounts.emailTemplates.siteName;

    // Check if siteName has been given
    if( siteName ) {
      return '[' + siteName + '] ' + 'Verify Your Email Address';
    } else {
      return 'Verify Your Email Address';
    }
  },
  text( user, url ) {
    let emailAddress   = user.emails[0].address,
        // Take out hash from url to use custom route behaviour
        urlWithoutHash = url.replace( '#/', '' ),
        emailMessage = TAPi18n.__('emailTemplates_verifyEmail'),
        // Construct emailBody
        emailBody = `${emailMessage}\n\n${urlWithoutHash}`;

    return emailBody;
  }
};
