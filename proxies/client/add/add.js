import { Template } from 'meteor/templating';
import { Proxies } from '../../collection';

Template.addProxy.helpers({
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
  },
});
