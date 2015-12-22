Template.frontendInformation.helpers({
  frontendHost: function () {
    // Get reference to template instance
    var instance = Template.instance();

    // Get value of frontend host from reactive variable
    var frontendHost = ReactiveMethod.call("getApiUmbrellaHost");

    return frontendHost;
  }
});
