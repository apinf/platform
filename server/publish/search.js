Meteor.publish("searchApiBackends", function(searchValue) {

  if (!searchValue || searchValue == "") return {};

  var query = {
    $or: [
      {
        name: {
          $regex: searchValue,
          $options: 'i'
        }
      },
      {
        backend_host: {
          $regex: searchValue,
          $options: 'i'
        }
      }
    ]
  };

  // Fetch apiBackends
  var searchResults = ApiBackends.find(query);

  return searchResults;
});
