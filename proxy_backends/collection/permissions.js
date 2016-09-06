// Apinf import
import { ProxyBackends } from './';

ProxyBackends.allow({
  insert () {
    return true;
  },
  update () {
    return true;
  },
  delete () {
    return true;
  },
});
