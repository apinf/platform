Meteor.methods({
  'searchApiBackends': function (searchQuery) {

    // searchApiBackends methods takes 1 parameter - search query string

    // check if searchQuery is ok

    // parse searchQuery

    // Construct query
    var query = {
      $or: [
        {
          name: {
            $regex: searchQuery,
            $options: 'i'
          }
        },
        {
          backend_host: {
            $regex: searchQuery,
            $options: 'i'
          }
        }
      ]
    };

    // Fetch apiBackends
    var foundApiBackends = ApiBackends.find(query).fetch();

    // return found API Backends
    return foundApiBackends;
  }
});
