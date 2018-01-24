/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

import { _ } from 'meteor/underscore';
import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';
import { Tracker } from 'meteor/tracker';

const withDiv = function (callback) {
  const el = document.createElement('div');
  el.setAttribute('id', 'myId');
  document.body.appendChild(el);
  try {
    callback(el);
  } finally {
    document.body.removeChild(el);
  }
};

const withRenderedTemplate = function (templateData, callback) {
  withDiv((el) => {
    const ourTemplate = _.isString(templateData.template) ?
      Template[templateData.template] : templateData.template;
    // console.log(_.isString(template),": template - ",Template[template],": data - ",data);
    Blaze.renderWithData(ourTemplate, templateData.data || {}, el);
    Tracker.flush();
    callback(el);
  });
};
export { withRenderedTemplate as default };
/* import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { FlowRouter } from 'meteor/kadira:flow-router';
*/

/* export const withRenderedRoute = function(templates) {
    let routeRendered = new ReactiveVar(false);
    // Router.onAfterAction(function() {
    //     routeRendered.set(true);
    // });
    // let templatesRendered = [];
    if (Array.isArray(templates)) {
        templates.forEach(function(templateName) {
            let rendered = new ReactiveVar(false);
            console.log(': => ',Template)
            BlazeLayout.render('masterLayout', { main: templateName });
            rendered.set(true);
            templatesRendered.push(rendered);
        });
    }
    Tracker.autorun(function() {
        const areTemplatesRendered = templatesRendered.every(function(rendered) {
            return rendered.get();
        });
        if (routeRendered.get() && areTemplatesRendered) {
          FlowRouter.onAfterAction(function() {});
          if (callback) {
            console.log(" if callback")
              callback();
          }
        }
    });
};*/
