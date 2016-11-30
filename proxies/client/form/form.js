import { Template } from 'meteor/templating';
import { Proxies } from '../../collection';

import registeredProxies from '../../collection/schemas/registered_proxies.js';

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
