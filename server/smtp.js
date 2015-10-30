+Meteor.startup(function() {
  /*extend settings.json with username and password:
  "mail": {
    "username" : "xxxx",
      "password" : "xxxx"
  }*/
  var username = Settings.findOne().mailgun_username;
  var password = Settings.findOne().mailgun_password;
  var server = "smtp.mailgun.org";
  var port = "587"

  process.env.MAIL_URL = 'smtp://' + encodeURIComponent(username) + ':' + encodeURIComponent(password) + '@' + encodeURIComponent(server) + ':' + port;
});
