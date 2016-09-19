import { Branding } from '/branding/collection';
import { Settings } from '/settings/collection';

// Get site title from Branding
export function getSiteTitle () {
  // Get branding
  const branding = Branding.findOne();

  // Check branding exists
  if( branding ) {
    return branding.siteTitle;
  }
}
// Get fromEmail from Settings
export function getFromEmail () {
  // Get settings
  const settings = Settings.findOne();

  // Check settings exists
  if( settings && settings.mail && settings.mail.fromEmail ) {
    // Return fromEmail
    return '<'+settings.mail.fromEmail+'>';
  }
}
