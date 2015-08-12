Template.statusCheck.rendered = function () {
  Meteor.call("statusCheck", function (err, status) {

    var apinfState       = $('#apinfState');
    var esState          = $('#esState');
    var apiUmbrellaState = $('#apiUmbrellaState');
    var fullState        = $('#fullState');

    //apinf
    if (status.apinf.operational){
      apinfState.addClass('text-success');
    }else{
      apinfState.addClass('text-danger');
    }

    apinfState.html(status.apinf.message);

    //apiUmbrella
    if (status.apiUmbrella.operational){
      apiUmbrellaState.addClass('text-success');
    }else{
      apiUmbrellaState.addClass('text-danger');
    }

    apiUmbrellaState.html(status.apiUmbrella.message);

    //elasticsearch
    if (status.elasticsearch.operational){
      esState.addClass('text-success');
    }else{
      esState.addClass('text-danger');
    }

    esState.html(status.elasticsearch.message);

    //all
    if (status.apinf.operational && status.apiUmbrella.operational && status.elasticsearch.operational){
      fullState.addClass('alert-success');
      fullState.html('All systems operational.')
    }

  })
};
