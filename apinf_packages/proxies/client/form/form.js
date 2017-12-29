/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Collection imports
import Proxies from '../../collection';

// APInf imports
import registeredProxies from '../../collection/registered_proxies.js';

Template.proxyForm.helpers({
  proxiesCollection () {
    return Proxies;
  },
  formType () {
    const instance = Template.instance();

    // placeholder for form type (insert or update)
    let formType;

    if (instance.data && instance.data.proxy) {
      // Form type should be update
      formType = 'update';
    } else {
      // Form type should be insert
      formType = 'insert';
    }

    return formType;
  },
  registeredProxies () {
    return registeredProxies;
  },
});
