import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import $ from 'jquery';
import Clipboard from 'clipboard';
import ApiKeys from '/api_keys/collection';
import { Proxies } from '/proxies/collection';
import Posts from '/oembed_content/collection';
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';

Template.apiDetails.onRendered(() => {
  // Initialize Clipboard copy button
  const copyButton = new Clipboard('#copyApiUrl');

  // Tooltip position
  $('#copyApiUrl').tooltip({
    trigger: 'click',
    placement: 'bottom',
  });

  // Tell the user when copy is successful
  copyButton.on('success', () => {
    $('#copyApiUrl').tooltip('hide')
      .attr('data-original-title', 'Copied!')
      .tooltip('show');
  });
});

Template.apiDetails.helpers({
  proxyUrl () {
    // Get reference to template instance
    const instance = Template.instance();

    // placeholder for output URL
    let proxyUrl;

    if (instance.data.proxyBackend) {
      // Get proxyBackend from template data
      const proxyBackend = instance.data.proxyBackend;
      // Get the proxy settings
      const proxy = Proxies.findOne(proxyBackend.proxyId);
      // Get Proxy host
      const host = proxy.apiUmbrella.url;

      // Get proxy frontend prefix
      let frontendPrefix = '';

      // It can be moment when proxyBackend exists but url_matches isn't
      if (proxyBackend.apiUmbrella.url_matches) {
        frontendPrefix = proxyBackend.apiUmbrella.url_matches[0].frontend_prefix;
      }

      // Construct the URL from host and base path
      proxyUrl = host + frontendPrefix;
    }
    return proxyUrl;
  },
  apiKey () {
    // Placeholder for API key
    let apiKey;

    // Get current user
    const currentUserId = Meteor.userId();

    // Get proxyId to template data
    const proxyId = Template.currentData().proxyBackend.proxyId;

    // Make sure user exists and has API key
    if (currentUserId && proxyId) {
      // Get API Key document
      const userApiKey = ApiKeys.findOne({ userId: currentUserId, proxyId });

      // Check that Umbrella API key exists
      if (userApiKey && userApiKey.apiUmbrella) {
        // Get the API Key, from API key document
        apiKey = userApiKey.apiUmbrella.apiKey;
      }
    }

    return apiKey;
  },
  // Check disable API key setting
  disableApiKey () {
    // Get reference to disable API key setting
    const disableApiKey = Template.currentData().proxyBackend.apiUmbrella.settings.disable_api_key;

    return disableApiKey;
  },
  // User has got an api key
  hasApiKey () {
    // Placeholder for API key
    let apiKey;

    // Get current user
    const currentUserId = Meteor.userId();

    // Get proxyId to template data
    const proxyId = Template.currentData().proxyBackend.proxyId;

    // Make sure user exists and has API key
    if (currentUserId && proxyId) {
      // Get API key by userId & proxyId
      apiKey = ApiKeys.findOne({ userId: currentUserId, proxyId });
    }
    // Return apiKey
    return apiKey;
  },
  showIfPostsOrUserHasRights () {
    return Posts.find().count();

    // if (Posts.find().count() > 0) {
    //   console.log('po=', Posts.find().count());
    //
    //   return true;
    // }

    // const userId = Meteor.userId();

    // Check that user is logged in
    // if (userId) {
    //   // Check if user is manager of this API
    //   const userIsManager = this.api.currentUserCanManage();
    //
    //   console.log('man=', userIsManager);
    //   // if user is manager or administrator, they can edit
    //   return userIsManager;
    // }
  },
});

Template.apiDetails.events({
  'click #add_oembed': function (e) {
    const api = this.api;
    Modal.show('postsForm', { pageHeader: 'Add Embedded Content', api });
  },
});
