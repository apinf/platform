import { Proxies } from '/proxies/collection/';
import initialProxies from '../initialProxies';

window.Proxies = Proxies;

Template.addProxy.helpers({
  initialProxies () {
    return initialProxies;
  }
});
