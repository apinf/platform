
if (Meteor.isClient) {
  Template.linkTemplate.events({
    'click .link-github': function () {
      Meteor.linkWithGithub();
    },
    'click .unlink-github': function () {
      Meteor.call('_accounts/unlink/service', Meteor.userId(), 'github');
    }
  });

  Template.linkTemplate.helpers({
    services: function () {
      var user = Meteor.user();
      if (user) {
        return _.keys(user.services);
      } else {
        return;
      }
    }
  });
}

if (Meteor.isServer) {
  //XXX input your api keys here or follow the onscreen popup  instructions
  ServiceConfiguration.configurations.upsert({service: 'github'}, {
    $set: {
      clientId: 'aadf73a20f54041e0c52',
      secret: '7571cfac793e5b3ec8cb41923b77289803c33413',
      loginStyle: 'popup'
    }
  });

  Meteor.methods({
  '_accounts/unlink/service': function (userId, serviceName) {
    Accounts.unlinkService(userId, serviceName);
  }
  });
}
