import proxiesList from './list';

proxiesList.forEach((proxy) => {
  exports[proxy] = require('./schemas/'+proxy);
});
