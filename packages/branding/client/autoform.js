/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor contributed packages imports
import { AutoForm } from 'meteor/aldeed:autoform';
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';

// Collection imports
import Branding from '/branding/collection';

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
