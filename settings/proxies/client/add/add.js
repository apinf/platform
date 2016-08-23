import { Proxies } from '../../collection';
import proxiesList from '../../default/list';

import { Template } from 'meteor/templating';

Template.addProxy.helpers({
  proxiesList () {
    return proxiesList;
  },
  proxiesCollection () {
    return Proxies;
  },
  proxy () {
    const instance = Template.instance();
    return instance.data.proxy;
  },
  formType () {
    const instance = Template.instance();

    // Return formType depending on the action e.g. editing or adding
    return (instance.data.isEdit) ? 'update' : 'insert';
  }
});
