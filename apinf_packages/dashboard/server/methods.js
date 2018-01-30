/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// Meteor contributed packages imports
import { Roles } from 'meteor/alanning:roles';

// Collection imports
import Apis from '/apinf_packages/apis/collection';
import Proxies from '/apinf_packages/proxies/collection';
import ProxyBackends from '/apinf_packages/proxy_backends/collection';
import Organizations from '/apinf_packages/organizations/collection';
import OrganizationApis from '/apinf_packages/organization_apis/collection';

Meteor.methods({
  getProxiesList (type) {
    // Make sure the parameter is String type
    check(type, String);

    // Return proxies list with specified type
    return Proxies.find({ type }).fetch();
  },
  proxyBackendExists (apiSlug) {
    check(apiSlug, String);

    // Get API
    const api = Apis.findOne({ slug: apiSlug });

    let proxyBackend;

    // Make sure API exists
    if (api) {
      // Get related Proxy Backend configuretion
      proxyBackend = ProxyBackends.findOne({ apiId: api._id });
    }

    return proxyBackend;
  },
  userCanViewAnalytic (apiId) {
    // Make sure apiId is a string
    check(apiId, String);

    // Get API
    const api = Apis.findOne(apiId);

    // Check if user can edit
    return api && api.currentUserCanManage();
  },
  myApisIds () {
    // Return IDs list of APIs are managed by current user
    return Apis.find({ managerIds: { $in: [this.userId] } }).map(api => {
      return api._id;
    });
  },
  managedApisIds (myApis) {
    // Make sure parameter exists and is Array
    check(myApis, Array);

    // Get Organizations IDs which are managed by current user
    const managedOrganizationIds = Organizations
      .find({ managerIds: { $in: [this.userId] } })
      .map(organization => {
        return organization._id;
      });

    // Get APIs IDs that are connected to the managed organizations
    const apiIds = OrganizationApis
      .find({ organizationId: { $in: managedOrganizationIds } })
      .map(organizationApi => {
        return organizationApi.apiId;
      });

    // Return IDs list of managed APIs of Organizations and no owned
    return Apis
      .find({ _id: { $in: apiIds, $nin: myApis } })
      .map(api => {
        return api._id;
      });
  },
  otherApisIds (myApis, managedApis) {
    // Check parameters are array
    check(myApis, Array);
    check(managedApis, Array);

    // Get APIs which are not managed by current user
    // And are not connected to Organizations which the current user is manager
    // Return IDs list of these APIs
    return Apis
      .find({ _id: { $nin: myApis.concat(managedApis) } })
      .map(api => {
        return api._id;
      });
  },
  groupingBackendIds (proxyId) {
    check(proxyId, String);
    let otherApis = [];
    // Placeholder to store ids
    const groupingIds = {
      myApis: [],
      managedApis: [],
      otherApis: [],
    };

    // Get IDs of owned APIs
    const myApis = Meteor.call('myApisIds');
    // Get IDs of managed APIs
    const managedApis = Meteor.call('managedApisIds', groupingIds.myApis);
    // Make sure user is admin
    if (Roles.userIsInRole(this.userId, ['admin'])) {
      // Get IDs of other APIs
      otherApis = Meteor.call('otherApisIds', myApis, managedApis);
      // Get related Proxy Backend IDs
      groupingIds.otherApis = ProxyBackends
        .find({ apiId: { $in: otherApis }, proxyId })
        .map(backend => { return backend._id; });
    }

    // Get related Proxy Backend IDs
    groupingIds.myApis = ProxyBackends
      .find({ apiId: { $in: myApis }, proxyId })
      .map(backend => { return backend._id; });

    groupingIds.managedApis = ProxyBackends
      .find({ apiId: { $in: managedApis }, proxyId })
      .map(backend => { return backend._id; });

    // Return all lists of IDs
    return groupingIds;
  },
});
