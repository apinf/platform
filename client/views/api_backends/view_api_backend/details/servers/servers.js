Template.viewApiBackendServers.helpers({
  "serverBackendProtocolClass": function () {
    // Get API Backend protocol
    var apiBackendProtocol = this.apiBackend.backend_protocol;

    // Change the class to 'warning' if protocol is HTTP; 'success' if HTTPS
    if (apiBackendProtocol === "http") {
      return "warning";
    } else if (apiBackendProtocol === "https") {
      return "success";
    }
  }
});
