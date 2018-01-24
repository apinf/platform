/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';

import '/apinf_packages/core/client/footer/footer.html';
import '/apinf_packages/core/client/footer/social_media.html';
import '/apinf_packages/core/client/language_select/language.js';

Template.footer.events({
  'click #about-button': function () {
    // Show the 'about Apinf' modal
    Modal.show('aboutApinf');
  },
});
