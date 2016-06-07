import { githubConfigurationValid } from '/lib/helperFunctions/githubConfigurationValid';

// If settings are already in Meteor.settings
try {

  const settings = Settings.findOne();

  if (githubConfigurationValid(setting)) {

    ServiceConfiguration.configurations.remove({
      // removing existing configurations
      service: 'github'
    });

    ServiceConfiguration.configurations.insert({
      /*extend settings.json with Client ID and Client Secret:
    "githubConfiguration": {
      "clientId" : "xxxx",
      "secret" : "xxxx"
    }*/
      service: 'github',
      clientId: settings.githubConfiguration.clientId,
      secret: settings.githubConfiguration.secret

    });
  }
}
//otherwise show an error
catch (error) {
  console.log(error);
}
