/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */


const request = require('superagent');
const { organizations, users } = require('./endpointConfiguration.js');
const {
  buildCredentialHeader,
  hasError,
  // getUserCredentials,
  // getRegularUserCredentials,
  performLogin,
  createUser,
  clearCollection,
  isArray,
  newOrganization,
} = require('./testHelper.js');

// describe('newOrganization object', () => {
//   it('should equal to expected object', () => {
//     expect(newOrganization.name.split(' - ')[0]).toEqual(`Organization Name`);
//     expect(newOrganization.description).toEqual('Description about Organization');
//     expect(newOrganization.url).toEqual('https://organization.com');
//     expect(newOrganization.contact_name).toEqual('David Bar');
//     expect(newOrganization.contact_phone).toEqual('+7 000 000 00 00');
//     expect(newOrganization.contact_email).toEqual('company-mail@gmail.com');
//     expect(newOrganization.facebook).toEqual('http://url.com');
//     expect(newOrganization.twitter).toEqual('http://url.com');
//     expect(newOrganization.instagram).toEqual('http://url.com');
//     expect(newOrganization.linkedIn).toEqual('http://url.com');
//   })
// })
//
// describe('isArray method', () => {
//   it('should return true for an array', () => {
//     expect(isArray([])).toEqual(true);
//   })
//   it('should return false for object', () => {
//     expect(isArray({})).toEqual(false);
//   })
//   it('should return false for string', () => {
//     expect(isArray('string')).toEqual(false);
//   })
//   it('should return false for function', () => {
//     expect(isArray(() => {})).toEqual(false);
//   })
//   it('should return false for number', () => {
//     expect(isArray(0)).toEqual(false);
//   })
// })
//
// describe('buildCredentialHeader method', () => {
//   it('should return correct object with right property names', () => {
//     const authData = {
//       authToken: 'authToken',
//       userId: 'userId',
//     };
//     const credentials = buildCredentialHeader(authData);
//     expect(credentials['X-Auth-Token']).toEqual(authData.authToken);
//     expect(credentials['X-User-Id']).toEqual(authData.userId);
//   })
// })

// describe('clearCollection method', () => {
//   it('should completely clear collection', async () => {
//     const result = await clearCollection('Organizations')
//   })
// })

describe('createUser Method', () => {
  it('should create new user', async () => {
    try {
      const newUser = await createUser(users.credentials)
      console.log(newUser)
    } catch (newUserError) {
      console.log('has-error')
      console.log(newUserError)
    }
  })
  // it('should not modify existing user', async () => {
  //
  // })
})
