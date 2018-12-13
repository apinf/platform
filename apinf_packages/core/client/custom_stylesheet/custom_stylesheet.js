/* Copyright 2018 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11

import { Template } from 'meteor/templating';
import { Branding } from '/branding/collection';
const tinycolor = require('tinycolor2');

Template.customStylesheet.helpers({
  mostReadableBackgound () {
    // Get branding
    const branding = Branding.findOne();

    // Placeholder variables
    let backgroundColor;
    let textColor;
    let lighterBackgroundReadability;
    let darkerBackgroundReadability;
    let mostReadableBackground;

    if (branding && branding.colors && branding.colors.primary) {
      // Get background color
      backgroundColor = branding.colors.primary;
    }

    if (branding && branding.colors && branding.colors.primaryText) {
      // Get text color
      textColor = branding.colors.primaryText;
    }

    if (backgroundColor && textColor) {
      // Lighten and darken the background color, for contrast comparison
      const lighterBackground = tinycolor(backgroundColor).lighten();
      const darkerBackground = tinycolor(backgroundColor).darken();

      // Get readability values for each combination of background/text color
      lighterBackgroundReadability = tinycolor.readability(lighterBackground, textColor);
      darkerBackgroundReadability = tinycolor.readability(darkerBackground, textColor);

      // Select darker or lighter background based on best readability
      if (lighterBackgroundReadability > darkerBackgroundReadability) {
        // lighter background is most readable
        mostReadableBackground = lighterBackground;
      } else {
        // darker background is most readable
        mostReadableBackground = darkerBackground;
      }

      return mostReadableBackground;
    }
  },
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
}); */
