if (Meteor.isClient) {
  Template.registerHelper('momentumIRTransition', function() {
    return function(from, to, element) {
      return "fade";
    };
  });
}
