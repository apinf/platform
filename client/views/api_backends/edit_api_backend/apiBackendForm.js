Template.editApiBackend.helpers({
  'formType': function () {
    //check for router id parametr
    var router = Router.current()
    if (router.params._id) {
      return 'insert';
    } else {
      return 'update';
    }
  }
});
