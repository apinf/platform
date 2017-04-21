/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Factory } from 'meteor/dburles:factory';

// Npm packages imports
import _ from 'lodash';
import faker from 'faker';

// Collection imports
import Branding from './';

// Define branding factory for tests and seeds
// Make sure it has the same fields as the Schema.
Factory.define('branding', Branding, {
  projectLogoFileId: () => { return 'projectLogoFileId'; },
  coverPhotoFileId: () => { return 'coverPhotoFileId'; },
  colors: () => {},
  'colors.primary': () => { return faker.internet.color(); },
  'colors.primaryText': () => { return faker.commerce.color(); },
  'colors.coverPhotoOverlay': () => { return faker.internet.color(); },
  'colors.overlayTransparency': () => { return _.random(0, 100); },
  siteTitle: () => { return faker.company.companyName(); },
  siteSlogan: () => { return faker.company.catchPhrase(); },
  siteFooter: () => { return faker.company.bs(); },
  privacyPolicy: () => { return faker.lorem.sentences(5); },
  termsOfUse: () => { return faker.lorem.paragraphs(3); },
  socialMedia: () => {
    return [
      {
        name: ['Facebook', 'Twitter', 'Github'][_.random(0, 2)],
        url: faker.internet.url(),
      },
    ];
  },
});
