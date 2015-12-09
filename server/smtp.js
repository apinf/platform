Meteor.startup(function() {
  /*extend settings.json with username and password:
  "mail": {
    "username" : "xxxx",
      "password" : "xxxx"
  }*/
  // If settings are already in Settings collection
  if ( Settings.findOne() ) {
    var username = Settings.findOne().mail.username;
    var password = Settings.findOne().mail.password;

    // If settings are available in Meteor.settings
  } else if ( Meteor.settings ){
    var username = Meteor.settings.mail.username;
    var password = Meteor.settings.mail.password;

  } try {
    var username = Meteor.settings.mail.username;
    var password = Meteor.settings.mail.password;

    // otherwise show an error
  } catch (_error) {
    e = _error;
  }
  var server = "smtp.mailgun.org";
  var port = "587"

  process.env.MAIL_URL = 'smtp://' + encodeURIComponent(username) + ':' + encodeURIComponent(password) + '@' + encodeURIComponent(server) + ':' + port;
});
