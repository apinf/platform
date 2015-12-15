Meteor.publish("search", function(searchValue) {

  if (!searchValue || searchValue == "") {

    console.log("search val not defined");
    return {};
  }

  console.log("Searching for ", searchValue);

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
