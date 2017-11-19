/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
/* eslint-disable max-len */

// Import node packages
import path from 'path';

// Defining root path of the project
const currentPath = path.resolve(__dirname);
const rootPath = currentPath.replace('/tests/apinf_packages/ratings', '');
const ratingsPath = `${rootPath}/apinf_packages/ratings/functions_index.js`;

// ES5 require had to be used because the 'import' statement is static and cannot
// depend on runtime information
const { collection } = require(ratingsPath);

const { insert, update } = collection;

describe('Ratings Package', () => {
  console.log()
  describe('Collection module', () => {
    describe('permission.js functions', () => {
      describe('insert function', () => {
        it('should return true when userId is defined', () => {
          // Define userId variable
          const userId = 'userId';

          // Flag to define if user and insert rating
          const canInsert = insert(userId);

          expect(canInsert).toEqual(true);
        });

        it('should return false when userId is not defined', () => {
          // Define userId variable
          const userId = '';

          // Flag to define if user and insert rating
          const canInsert = insert(userId);

          expect(canInsert).toEqual(false);
        });
      });

      describe('update function', () => {
        it('should return true when userId is equal to the rating userId', () => {
          // Define userId variable
          const userId = 'userId';

          // Define rating variable
          const rating = { userId };

          // Flag to define if user and update rating
          const canUpdate = update(userId, rating);

          expect(canUpdate).toEqual(true);
        });

        it('should return false when userId is not defined', () => {
          // Define userId variable
          const userId = 'userId';

          // Define rating variable
          const rating = { userId: 'otherUserId' };

          // Flag to define if user and update rating
          const canUpdate = update(userId, rating);

          expect(canUpdate).toEqual(false);
        });
      });
    });
  });
});
