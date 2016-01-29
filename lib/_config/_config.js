Config = {
  name: 'Apinf',
  domain: "apinf.io", // How to get this from settings?
  subtitle: function() {
    return TAPi18n.__('configSubtitle');
  },
  defaultLanguage: 'en',
  dateFormat: 'D/M/YYYY',
  privacyUrl: 'http://meteorfactory.io',
  termsUrl: 'http://meteorfactory.io',
  legal: {
    address: 'Jessnerstrasse 18, 12047 Berlin',
    name: 'Meteor Factory',
    url: 'http://benjaminpeterjones.com'
  },
  about: 'http://samposoftware.com',
  blog: 'http://blog.samposoftware.com',
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
  },
  homeRoute: '/',
  publicRoutes: ['home'],
  dashboardRoute: '/dashboard'
};
