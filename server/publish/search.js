Meteor.publish("searchApiBackends", function(searchValue) {

  if (!searchValue || searchValue == "")
    return ApiBackends.find({});

  // Remove leading & trailing spaces from search value
  searchValue = searchValue.trim();

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
