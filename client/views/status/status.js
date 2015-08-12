Template.statusCheck.rendered = function () {
  Meteor.call("statusCheck", function (err, status) {

    var apinfState       = $('#apinfState');
    var esState          = $('#esState');
    var apiUmbrellaState = $('#apiUmbrellaState');

    //apinf
    if (status.apinf.operational){
      apinfState.addClass('alert-success');
      apinfState.html(status.apinf.message);
    }

    //elasticsearch

    //apiumbrell

  })
};
