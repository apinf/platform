const checkRightsToViewApiBackend = function () {
  // Save a reference to route, for use inside method callback function
  const route = this;

  // Get current API Backend ID
  const apiBackendId = Router.current().params._id;

  try {
    Meteor.call("currentUserCanViewApi", apiBackendId, route, function (error, result) {
      if (error) {
        console.log(error);
      }
      console.log(result);
      console.log(result);
      //console.log(userCanView)
      //console.log(route);
      //console.log(Router);
      //route.next();
      // if (userCanView) {
      //   route.next()
      // } else {
      //   Router.go("notAuthorized");
      // }
    });
  } catch (error) {
    console.log(error);
  }


  this.next();
};

// Check that user has rights to view API
Router.onBeforeAction(checkRightsToViewApiBackend, {only: ['viewApiBackend']});
