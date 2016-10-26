import { Template } from 'meteor/templating';
import { Branding } from '/branding/collection';

Template.customStylesheet.helpers({
  primaryColor () {
    // Get branding
    const branding = Branding.findOne();

    let primaryColor;

    if (branding && branding.colors && branding.colors.primary) {
      primaryColor = branding.colors.primary;
    }

    return primaryColor;
  },
  primaryColorText () {
    // Get branding
    const branding = Branding.findOne();

    let primaryColorText;

    if (branding && branding.colors && branding.colors.primaryText) {
      primaryColorText = branding.colors.primaryText;
    }

    return primaryColorText;
  },
});
