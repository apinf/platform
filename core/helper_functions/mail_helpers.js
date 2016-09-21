import { Branding } from '/branding/collection';
import { Settings } from '/settings/collection';

// Get site title from Branding
export function getSiteTitle () {
  // Get branding
  const branding = Branding.findOne();

  // Init return value
  let siteTitle = '';

  // Check branding & siteTitle exists
  if (branding && branding.siteTitle) {
    siteTitle = branding.siteTitle;
  }
  return siteTitle;
}
// Get fromEmail from Settings
// Parameters: smtpFormat Boolean - adds formatting eg. <info@apinf.io>
export function getFromEmail (smtpFormat = false) {
  // Get settings
  const settings = Settings.findOne();

  // Init return value
  let fromEmail;

  // Check settings exists
  if (settings && settings.mail && settings.mail.fromEmail) {
    // Check whether to return in smtpFormat
    if (smtpFormat) {
      fromEmail = settings.mail.fromEmail;
      fromEmail = `<${fromEmail}>`;
    } else {
      fromEmail = settings.mail.fromEmail;
    }
  }
  // Return fromEmail
  return fromEmail;
}
