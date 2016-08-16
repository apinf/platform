import { Proxies } from '../collection';
import proxiesList from '../default/list';

window.Proxies = Proxies;

Template.addProxy.helpers({
  proxiesList () {
    return proxiesList;
  }
});
