Template.viewApiBackendPageHeader.helpers({
  proxyIsConfigured () {
    // Check if one or more proxy has been configured
    let proxyIsConfigured;

    const proxyCount = Proxies.find().count();

    if (proxyCount > 0) {
      proxyIsConfigured = true;
    } else {
      proxyIsConfigured = false;
    }

    return proxyIsConfigured;
  },
});
