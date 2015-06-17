(function() {
  this.Config = {
    name: 'Apinf',
    title: function() {
      return TAPi18n.__('configTitle');
    },
    subtitle: function() {
      return TAPi18n.__('configSubtitle');
    },
    logo: function() {
      return '<b>' + this.name + '</b>';
    },
    footer: function() {
      return this.name + ' - Copyright ' + new Date().getFullYear();
    },
    emails: {
      from: 'no-reply@' + Meteor.absoluteUrl(),
      contact: 'hello' + Meteor.absoluteUrl()
    },
    username: false,
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
        url: 'https://www.facebook.com/pages/APInf/816677401742945',
        icon: 'facebook'
      },
      twitter: {
        url: 'https://twitter.com/APInf_Suomi',
        icon: 'twitter'
      },
      github: {
        url: 'https://github.com/apinf',
        icon: 'github'
      }
    },
    homeRoute: '/',
    publicRoutes: ['home'],
    dashboardRoute: '/dashboard'
  };

}).call(this);
