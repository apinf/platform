/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Npm packages imports
import Raven from 'raven';
import _ from 'lodash';

const wrapMethodHanderForErrors = function (name, originalHandler, methodMap) {
  methodMap[name] = function () {
    try {
      // eslint-disable-next-line
      return originalHandler.apply(this, arguments);
    } catch (ex) {
      Raven.captureException(ex);
      throw ex;
    }
  };
};

// TODO: the same for Publish function
export default function wrapMethods () {
  const originalMeteorMethods = Meteor.methods;
  // Wrap future method handlers for capturing errors
  Meteor.methods = function (methodMap) {
    _.forEach(methodMap, (handler, name) => {
      wrapMethodHanderForErrors(name, handler, methodMap);
    });
    originalMeteorMethods(methodMap);
  };

  // Wrap existing method handlers for capturing errors
  _.forEach(Meteor.default_server.method_handlers, (handler, name) => {
    wrapMethodHanderForErrors(name, handler, Meteor.default_server.method_handlers);
  });
}
