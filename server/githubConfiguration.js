// If settings are already in Meteor.settings
if ( Meteor.settings ) {

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
    clientId: Meteor.settings.githubConfiguration.clientId,
    secret: Meteor.settings.githubConfiguration.secret

  });

}

// If settings are available in Settings collection
else if ( Settings.findOne() ) {

  ServiceConfiguration.configurations.remove({
    // removing existing configurations
    service: 'github'
  });

  ServiceConfiguration.configurations.insert({
    service: 'github',
    clientId: Settings.findOne().githubConfiguration.clientId,
    secret: Settings.findOne().githubConfiguration.secret

  });


}
