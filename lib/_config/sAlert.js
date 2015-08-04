Meteor.startup(function() {
  if (Meteor.isClient) {
    return sAlert.config({
      effect: "stackslide",
      position: "bottom-right",
      timeout: 3000,
      html: false
    });
  }
});
