import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';

import $ from 'jquery';

Template.addEmqUser.events({
  'click #add-emq-user': function (event, templateInstance) {
    event.preventDefault();

    const emqProxy = templateInstance.data.emqProxy;

    const emqHttpApi = emqProxy.emq.httpApi;

    const username = $('#emq-user-username').val();
    const password = $('#emq-user-password').val();

    if (username && password) {
      Meteor.call('addEmqUser', emqHttpApi, { username, password }, (err, res) => {
        if (err) console.error(err);

        if (res.username === username) {
          const emqUsers = templateInstance.data.emqUsersReactive.get();

          emqUsers.push(res);

          templateInstance.data.emqUsersReactive.set(emqUsers);

          Modal.hide('addEmqUser');
        }
      });
    }
  },
});
