/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Factory } from 'meteor/dburles:factory';

// Npm packages imports
import _ from 'lodash';

// Collection imports
import Branding from './';

// Define branding factory for tests and seeds
// Make sure it has the same fields as the Schema.
Factory.define('branding', Branding, {
  projectLogoFileId: () => { return 'projectLogoFileId'; },
  coverPhotoFileId: () => { return 'coverPhotoFileId'; },
  colors: () => {},
  'colors.primary': () => { return '#fff'; },
  'colors.primaryText': () => { return 'black'; },
  'colors.coverPhotoOverlay': () => { return 'blue'; },
  'colors.overlayTransparency': () => { return _.random(0, 100); },
  siteTitle: () => { return 'Site Title'; },
  siteSlogan: () => { return 'Site slogan - catch phrase'; },
  siteFooter: () => { return 'Copyright Site Title'; },
  privacyPolicy: () => { return 'Privacy Policy'; },
  termsOfUse: () => { return 'Terms of Use'; },
  socialMedia: () => {
    return [
      {
        name: ['Facebook', 'Twitter', 'Github'][_.random(0, 2)],
        url: 'https://social.network/site',
      },
    ];
  },
});
