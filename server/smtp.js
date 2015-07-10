+Meteor.startup(function() {
  var username = "xxxx"; //add mail server username eg. from Mailgun
  var password = "xxxx"; // add mail password here
  var server = "smtp.mailgun.org";
  var port = "587"

  process.env.MAIL_URL = 'smtp://' + encodeURIComponent(username) + ':' + encodeURIComponent(password) + '@' + encodeURIComponent(server) + ':' + port;
});
