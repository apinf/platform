var options;

if (Meteor.isServer) {
  options = {
    siteName: Config.name
  };
  // Configurations for activation email template
  Accounts.emailTemplates.siteName = Config.name;
  Accounts.emailTemplates.from = Config.name+" <no-reply@"+Config.domain+">";

  if (Config.socialMedia) {
    _.each(Config.socialMedia, function(v, k) {
      return options[k] = v.url;
    });
  }
  if (Config.legal) {
    options.companyAddress = Config.legal.address;
    options.companyName = Config.legal.name;
    options.companyUrl = Config.legal.url;
  }
  PrettyEmail.options = options;
}
