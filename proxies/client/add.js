import { Proxies } from '../collection';
import proxiesList from '../proxiesList';

window.Proxies = Proxies;

Template.addProxy.helpers({
  proxiesList () {
    return proxiesList;
  }
});
