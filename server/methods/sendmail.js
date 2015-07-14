Meteor.methods({

  "sendmail": function(to) {
    var to = to,
    from = "register@apinf.com";

    Email.send({
      from: from,
      to: to,
      subject: "Registration complete ",
      text: "Welcome to Apinf. Enjoy your stay in the world of APIs."
    });
  }

});
