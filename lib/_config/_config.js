Config = {
  name: 'Apinf',
  domain: "apinf.io", // How to get this from settings?
  subtitle: function() {
    return TAPi18n.__('configSubtitle');
  },
  dateFormat: function () {

    var dateFormat = Settings.findOne().dateFormat;

    if (!dateFormat) {
      dateFormat = 'D/M/YYYY';
    }

    return dateFormat;
  },
  userLocale: function () {

    var userLocale = Settings.findOne().userLocale;

    if (!userLocale) {
      userLocale = 'en';
    }

    return userLocale;
  },
  legal: {
    address: 'Jessnerstrasse 18, 12047 Berlin',
    name: 'Meteor Factory',
    url: 'http://benjaminpeterjones.com'
  },
  socialMedia: {
    facebook: {
      url: 'http://facebook.com/benjaminpeterjones',
      icon: 'facebook'
    },
    twitter: {
      url: 'http://twitter.com/BenPeterJones',
      icon: 'twitter'
    },
    github: {
      url: 'http://github.com/yogiben',
      icon: 'github'
    },
    info: {
      url: 'http://meteorfactory.io',
      icon: 'link'
    }
  }
};
