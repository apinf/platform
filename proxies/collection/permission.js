import { Proxies } from './';

Proxies.allow({
  insert: function () {
    return true;
  },
  update: function () {
    return false;
  },
  remove: function () {
    return false;
  }
});
