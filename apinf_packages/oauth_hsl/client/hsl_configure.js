/* Copyright 2018 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

Template.configureLoginServiceDialogForHsl.helpers({
  siteUrl: Meteor.absoluteUrl(),
});

Template.configureLoginServiceDialogForHsl.fields = function () {
  return [
    { property: 'clientId', label: 'Client ID' },
    { property: 'secret', label: 'Client Secret' },
    { property: 'serverUrl', label: 'HSL Server URL' },
    { property: 'authorizationEndpoint', label: 'Authorization Endpoint' },
    { property: 'tokenEndpoint', label: 'Token Endpoint' },
    { property: 'userinfoEndpoint', label: 'Userinfo Endpoint' },
  ];
};