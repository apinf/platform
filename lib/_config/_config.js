Config = {
  name: 'Apinf',
  domain: "apinf.io", // How to get this from settings?
  subtitle: function() {
    return TAPi18n.__('configSubtitle');
  },
  dateFormat: function () {

    var dateFormat = Settings.findOne().dateFormat;

    if (dateFormat) {
      return dateFormat;
    } else {
      return 'D/M/YYYY';
    }

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
