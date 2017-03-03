import Branding from './';

Branding.helpers({
  privacyPolicyExists () {
    const privacyPolicy = this.privacyPolicy;

    // If editor is empty (has only this empty div)
    // see https://github.com/quilljs/quill/issues/1235
    if (privacyPolicy === '<div><br></div>') {
      return false;
    }
    return true;
  },
  termsOfUseExists () {
    const termsOfUse = this.termsOfUse;

    // If editor is empty (has only this empty div)
    // see https://github.com/quilljs/quill/issues/1235
    if (termsOfUse === '<div><br></div>') {
      return false;
    }
    return true;
  },
});
