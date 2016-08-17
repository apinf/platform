import { Proxies } from '../collection';
import proxiesList from '../default/list';

Template.addProxy.helpers({
  proxiesList () {
    return proxiesList;
  },
  proxiesCollection () {
    return Proxies;
  }
});
