import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { _ } from 'lodash';

Template.organizationManagersList.helpers({
  organizationManagers () {
    // Get API document, reactively
    const organization = Template.currentData().organization;

    // Get all authorized users for current API
    let organizationManagers = Meteor.users.find({
      _id: { $in: organization.managerIds },
    }).fetch();

    // flatten structure of users within authorized users array
    organizationManagers = _.map(organizationManagers, function (user) {
      return {
        username: user.username,
        email: user.emails[0].address,
        _id: user._id,
      };
    });

    return organizationManagers;
  },
});
