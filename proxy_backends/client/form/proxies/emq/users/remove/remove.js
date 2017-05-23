import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';

import _ from 'lodash';

Template.removeEmqUser.events({
  'click #remove-emq-user': function (event, templateInstance) {
    const user = templateInstance.data.user;
    const emqProxy = templateInstance.data.emqProxy;

    const emqHttpApi = emqProxy.emq.httpApi;

    Meteor.call('removeEmqUser', emqHttpApi, user.id, (err, res) => {
      if (err) console.error(err);

      if (res.id === user.id) {
        const emqUsers = templateInstance.data.emqUsersReactive.get();

        _.remove(emqUsers, (emqUser) => {
          return emqUser.id === user.id;
        });

        templateInstance.data.emqUsersReactive.set(emqUsers);

        Modal.hide('removeEmqUser');
      }
    });
  },
});
