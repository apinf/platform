import { AutoForm } from 'meteor/aldeed:autoform';
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
      } else if (privacyPolicy === '<div><br></div>') {
        Branding.update(this.docId, { $unset: { privacyPolicy: '' } });
      }
      return false;
    },
  },
});
