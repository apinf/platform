// Collection imports
import Apis from '/apis/collection';

Meteor.publish('searchApiBackends', (searchValue) => {
  // Make sure searchValue is a String
  check(searchValue, String);

  // Return all api's if searchValue is empty
  if (!searchValue || searchValue === '') { return Apis.find({}); }

  // Remove leading & trailing spaces from search value
  const searchRegex = searchValue.trim();

  // Construct query using regex
  const query = {
    $or: [
      {
        name: {
          $regex: searchRegex,
          $options: 'i', // case-insensitive option
        },
      },
      {
        backend_host: {
          $regex: searchRegex,
          $options: 'i', // case-insensitive option
        },
      },
    ],
  };

  // Fetch apiBackends
  const searchResults = Apis.find(query);

  return searchResults;
});
