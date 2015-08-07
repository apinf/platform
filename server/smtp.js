+Meteor.startup(function() {
  /*extend settings.json with username and password:
  "mail": {
    "username" : "xxxx",
      "password" : "xxxx"
  }*/
  var username = Meteor.settings.mail.username;
  var password = Meteor.settings.mail.password;
  var server = "smtp.mailgun.org";
  var port = "587"

  process.env.MAIL_URL = 'smtp://' + encodeURIComponent(username) + ':' + encodeURIComponent(password) + '@' + encodeURIComponent(server) + ':' + port;
});
