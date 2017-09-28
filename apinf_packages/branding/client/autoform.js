/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { AutoForm } from 'meteor/aldeed:autoform';
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';

// Collection imports
import Branding from '/apinf_packages/branding/collection';

AutoForm.hooks({
  brandingEdit: {
    onSuccess () {
      // Get termsOfUse
      const termsOfUse = this.currentDoc.termsOfUse;

      // Get privacyPolicy
      const privacyPolicy = this.currentDoc.termsOfUse;

      // If editor is empty (has only this empty div)
      // see https://github.com/quilljs/quill/issues/1235
      if (termsOfUse === '<div><br></div>') {
        Branding.update(this.docId, { $unset: { termsOfUse: '' } });
      }

      if (privacyPolicy === '<div><br></div>') {
        Branding.update(this.docId, { $unset: { privacyPolicy: '' } });
      }

      // Get branding form success message translation
      const message = TAPi18n.__('branding_successMessage');

      // Alert the user of successful save
      sAlert.success(message);
    },
  },
});

Template.autoForm.onRendered(function () {
  // Get ID of current AutoForm
  const formId = this.data.id;

  // Get localized text for featured APIs field
  const message = TAPi18n.__('branding_projectFeaturedApisMessage_featuredApiMessage');

  if (formId === 'brandingEdit') {
    // Render select2 widget on Featured APIs field
    $('[name=featuredApis]').select2({
      placeholder: message,
    });

  }
});