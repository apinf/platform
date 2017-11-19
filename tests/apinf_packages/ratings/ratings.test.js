/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
/* eslint-disable max-len */

// Import node packages
const path = require('path');

// Defining root path of the project
const currentPath = path.resolve(__dirname);
const rootPath = currentPath.replace('/tests/apinf_packages/ratings', '');
const ratingsPath = `${rootPath}/apinf_packages/ratings`;

// Import functions from Collection modules
const { insert, update } = require(`${ratingsPath}/collection/functions.js`);

// Import functions from Collections server modules
const { buildPublishFunctionWith } = require(`${ratingsPath}/collection/server/functions.js`);

describe('Ratings Package', () => {
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

    describe('publications.js functions', () => {
      describe('buildPublishFunctionWith fucntion', () => {
        it('should return rating from a user', () => {
          // Mock external functions needed by the module
          const check = (value, pattern, stringedPattern = pattern.toString()) => {
            // toString signature of pattern function
            const stringPattern = 'function String() { [native code] }';

            // Compare toString signature of function
            const isStringPattern = stringPattern === stringedPattern;

            if (isStringPattern) {
              return typeof value === 'string';
            }

            return undefined;
          };

          const ApiBackendRatings = {
            find ({ userId, apiBackendId }) {
              return {
                userId,
                apiBackendId,
                rating: Math.round(4 * Math.random()),
              };
            },
          };

          // Define variables
          const userId = 'userId';
          const apiBackendId = 'apiBackendId';

          // Define context
          const context = { userId }

          const result =
            buildPublishFunctionWith({ check, ApiBackendRatings, context })(apiBackendId)

          console.log(result);
        });
      });
    });
  });
});
