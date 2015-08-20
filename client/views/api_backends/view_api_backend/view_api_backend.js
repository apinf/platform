Template.viewApiBackend.created = function() {
    var instance = this;
    var backendId = Router.current().params.apiBackendId;
    instance.subscribe("apiBackend", backendId);
}
