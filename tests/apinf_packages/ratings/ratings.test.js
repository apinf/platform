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
const {
  publishMyApiBackendRating,
  publishMyApiBackendRatings,
} = require(`${ratingsPath}/collection/server/functions.js`);

// Import functions from client module
const {
  clickRateIt,
} = require(`${ratingsPath}/client/functions.js`);

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
      describe('publishMyApiBackendRating fucntion', () => {
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

            return false;
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
          const context = { userId };

          const result =
            publishMyApiBackendRating({ check, ApiBackendRatings, context })(apiBackendId);

          expect(result.userId).toEqual(userId);
          expect(result.apiBackendId).toEqual(apiBackendId);
          expect(Number.isInteger(result.rating)).toEqual(true);
        });
      });

      describe('publishMyApiBackendRatings fucntion', () => {
        it('should return all ratings from a user', () => {
          // Mock external functions needed by the module
          const ApiBackendRatings = {
            find ({ userId }) {
              const apiBackendId = 'apiBackendId';
              return [
                {
                  userId,
                  apiBackendId,
                  rating: Math.round(4 * Math.random()),
                },
                {
                  userId,
                  apiBackendId,
                  rating: Math.round(4 * Math.random()),
                },
              ];
            },
          };

          // Define variables
          const userId = 'userId';

          // Define context
          const context = { userId };

          const result =
            publishMyApiBackendRatings({ ApiBackendRatings, context })();

          expect(Array.isArray(result)).toEqual(true);
          expect(result.length).toEqual(2);
        });
      });

      describe('publishApiBackendRatings fucntion', () => {
        it('should return all ratings of a api', () => {
          // Mock external functions needed by the module
          const ApiBackendRatings = {
            find ({ apiBackendId }) {
              const userId = 'userId';
              return [
                {
                  userId,
                  apiBackendId,
                  rating: Math.round(4 * Math.random()),
                },
                {
                  userId,
                  apiBackendId,
                  rating: Math.round(4 * Math.random()),
                },
              ];
            },
          };

          const check = (value, pattern, stringedPattern = pattern.toString()) => {
            // toString signature of pattern function
            const stringPattern = 'function String() { [native code] }';

            // Compare toString signature of function
            const isStringPattern = stringPattern === stringedPattern;

            if (isStringPattern) {
              return typeof value === 'string';
            }

            return false;
          };

          // Define variables
          const apiBackendId = 'apiBackendId';

          const result =
            publishMyApiBackendRatings({ check, ApiBackendRatings })(apiBackendId);

          expect(Array.isArray(result)).toEqual(true);
          expect(result.length).toEqual(2);
        });
      });
    });
  });

  describe('Client module', () => {
    describe('rating.js functions', () => {
      describe('clickRateIt function', () => {
        it('should be a function', () => {
          expect(typeof clickRateIt).toEqual('function');
        });

        it('should be a currying function', () => {
          const validScopeArguments = {
            Meteor: true,
            ApiBackendRatings: true,
            TAPi18n: true,
            sAlert: true,
            $: true,
          };

          expect(typeof clickRateIt(validScopeArguments)).toEqual('function');
        });

        it('should return missing Meteor error', () => {
          const invalidScopeArguments = {
            ApiBackendRatings: true,
            TAPi18n: true,
            sAlert: true,
            $: true,
          };

          expect(clickRateIt(invalidScopeArguments).message).toEqual('Meteor not defined');
        });

        it('should return missing ApiBackendRatings error', () => {
          const invalidScopeArguments = {
            TAPi18n: true,
            Meteor: true,
            sAlert: true,
            $: true,
          };

          expect(clickRateIt(invalidScopeArguments).message).toEqual('ApiBackendRatings not defined');
        });

        it('should return missing TAPi18n error', () => {
          const invalidScopeArguments = {
            ApiBackendRatings: true,
            Meteor: true,
            sAlert: true,
            $: true,
          };

          expect(clickRateIt(invalidScopeArguments).message).toEqual('TAPi18n not defined');
        });

        it('should return missing sAlert error', () => {
          const invalidScopeArguments = {
            ApiBackendRatings: true,
            Meteor: true,
            TAPi18n: true,
            $: true,
          };

          expect(clickRateIt(invalidScopeArguments).message).toEqual('sAlert not defined');
        });

        it('should return missing jQuery error', () => {
          const invalidScopeArguments = {
            ApiBackendRatings: true,
            Meteor: true,
            TAPi18n: true,
            sAlert: true,
          };

          expect(clickRateIt(invalidScopeArguments).message).toEqual('jQuery not defined');
        });

        it('should return missing event error', () => {
          const validScopeArguments = {
            ApiBackendRatings: true,
            Meteor: true,
            TAPi18n: true,
            sAlert: true,
            $: true,
          };

          const curryingFunction = clickRateIt(validScopeArguments);

          expect(curryingFunction(false).message)
            .toEqual('event not defined');
        });

        it('should return missing event error', () => {
          const validScopeArguments = {
            ApiBackendRatings: true,
            Meteor: true,
            TAPi18n: true,
            sAlert: true,
            $: true,
          };

          const curryingFunction = clickRateIt(validScopeArguments);

          expect(curryingFunction(true, false).message)
            .toEqual('templateInstance not provided');
        });

        it('should return missing event error', () => {
          const validScopeArguments = {
            ApiBackendRatings: true,
            Meteor: true,
            TAPi18n: true,
            sAlert: true,
            $: true,
          };

          const curryingFunction = clickRateIt(validScopeArguments);

          expect(curryingFunction(true, { data: false }).message)
            .toEqual('templateInstance is invalid');
        });
      });
    });
  });
});
