Meteor.startup(function() {
  if (Meteor.isClient) {
    return SEO.config({
      title: Config.name,
      meta: {
        title: Config.name,
        description: Config.subtitle
      }
    });
  }
});
