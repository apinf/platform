import Apis from '/apis/collection';
import ProxyBackends from '/proxy_backends/collection';

ProxyBackends.helpers({
// eslint-disable-next-line object-shorthand
  apiName: function () {
    // Get API ID
    const apiId = this.apiId;
    // Get API
    const api = Apis.findOne(apiId);
    // Return API Name
    return api.name;
  },
});
