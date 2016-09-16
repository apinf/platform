// TODO: Get from settings?
Accounts.emailTemplates.siteName = "Apinf";
Accounts.emailTemplates.from     = "Apinf <info@apinf.io>";

Accounts.emailTemplates.verifyEmail = {
  subject() {
    return "[Apinf] Verify Your Email Address";
  },
  text( user, url ) {
    let emailAddress   = user.emails[0].address,
        urlWithoutHash = url.replace( '#/', '' ),
        emailBody      = `To verify your email address (${emailAddress}) visit \
        the following link:\n\n${urlWithoutHash}\n\n If you did not request \
        this verification, please ignore this email.`;

    return emailBody;
  }
};
