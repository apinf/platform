/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

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
