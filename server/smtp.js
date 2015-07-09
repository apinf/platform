+Meteor.startup(function() {
  var username = "postmaster@sandbox2b56b3a814c1462eb48ae9ee598c8321.mailgun.org";
  var password = "d85b4c55755388e4449549092e035153";
  var server = "smtp.mailgun.org";
  var port = "587"

  process.env.MAIL_URL = 'smtp://' + encodeURIComponent(username) + ':' + encodeURIComponent(password) + '@' + encodeURIComponent(server) + ':' + port;
});
