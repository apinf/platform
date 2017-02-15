// Meteor packages imports
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';

// Collection imports
import ApiFlags from '../../../collection';

Template.flagApiButton.onCreated(function () {
  // Create reference to instance
  const instance = this;

  // Get apibackend
  const apiId = instance.data.api._id;

  // Init reactive variable
  instance.apiFlag = new ReactiveVar();

  // Subscription
  instance.subscribe('singleApiFlag', apiId);

  instance.autorun(() => {
    if (instance.subscriptionsReady()) {
      instance.apiFlag.set(ApiFlags.findOne({ apiId }));
    }
  });
});

Template.flagApiButton.events({
  'click #openFlagApiModal': function () {
    // Create reference to instance
    const instance = Template.instance();

    // Show modal
    Modal.show('flagApiModal', { apiFlag: instance.apiFlag.get() });
  },
});

Template.flagApiButton.helpers({
  apiIsFlagged () {
    // Create reference to instance
    const instance = Template.instance();

    // Get value from reactive variable
    const apiFlag = instance.apiFlag.get();

    // Check if api flag exists
    return !!(apiFlag);
  },
});
