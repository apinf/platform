/* Copyright 2017 Apinf Oy
  This file is covered by the EUPL license.
  You may obtain a copy of the licence at
  https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

import { HTTP } from 'meteor/http';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import Proxies from '../../proxies/collection';

Meteor.methods({
  async addAclRule (data) {
    check(data, Object);

    const proxy = Proxies.findOne({ type: 'emq' });

    const url = proxy.emq.postgresEndpoint;

    try {
      return await HTTP.post(url, { data });
    } catch (e) {
      const message = e.response ? e.response.data.message : e.code;
      // Throw an error message
      throw new Meteor.Error(message);
    }
  },
  async deleteAclRule (ruleId) {
    check(ruleId, String);

    const proxy = Proxies.findOne({ type: 'emq' });

    const url = `${proxy.emq.postgresEndpoint}?id=eq.${ruleId}`;

    try {
      return await HTTP.del(url);
    } catch (e) {
      const message = e.response ? e.response.data.message : e.code;
      // Throw an error message
      throw new Meteor.Error(message);
    }
  },
  async editAclRule (ruleId, data) {
    check(ruleId, Number);
    check(data, Object);

    const proxy = Proxies.findOne({ type: 'emq' });

    const url = proxy.emq.postgresEndpoint;

    try {
      return await HTTP.call('PATCH', url, { params: { id: `eq.${ruleId}` }, data });
    } catch (e) {
      const message = e.response ? e.response.data.message : e.code;
      // Throw an error message
      throw new Meteor.Error(message);
    }
  },
  async getAclRules () {
    const proxy = Proxies.findOne({ type: 'emq' });

    const url = proxy.emq.postgresEndpoint;

    try {
      return await HTTP.get(url, { params: { order: 'id.asc' } });
    } catch (e) {
      const message = e.response ? e.response.data.message : e.code;
      // Throw an error message
      throw new Meteor.Error(message);
    }
  },
});
