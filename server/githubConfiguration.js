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
