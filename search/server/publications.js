import { Apis } from '/apis/collection/apis';

Meteor.publish("searchApiBackends", function(searchValue) {

  if (!searchValue || searchValue == "")
    return Apis.find({});

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
        url: {
          $regex: searchValue,
          $options: 'i' // case-insensitive option
        }
      }
    ]
  };

  // Fetch apiBackends
  var searchResults = Apis.find(query);

  return searchResults;
});
