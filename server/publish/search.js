Meteor.publish("searchApiBackends", function(searchValue) {

  if (!searchValue || searchValue == "")
    return ApiBackends.find({});

  // Remove leading & trailing spaces from search value
  searchValue = searchValue.trim();

  // Construct query using regex
  var query = {
    $or: [
      {
        name: {
          $regex: searchValue,
          $options: 'i' // case-insensitive option
        }
      },
      {
        backend_host: {
          $regex: searchValue,
          $options: 'i' // case-insensitive option
        }
      }
    ]
  };

  // Fetch apiBackends
  var searchResults = ApiBackends.find(query);

  return searchResults;
});
