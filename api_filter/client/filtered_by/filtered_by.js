import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { TAPi18n } from 'meteor/tap:i18n';

Template.apiFilteredBy.onCreated(function () {
  const instance = this;

  instance.selectedOption = new ReactiveVar();

  instance.autorun(() => {
    const selectedFilterOption = FlowRouter.getQueryParam('lifecycle');

    if (selectedFilterOption) {
      // Get translation for selected option
      const option = TAPi18n.__(`schemas.apis.lifecycleStatus.options.${selectedFilterOption}`);
      // Save option
      instance.selectedOption.set(option);
    } else {
      // Set option as undefined to hide text
      instance.selectedOption.set(undefined);
    }
  });
});

Template.apiFilteredBy.helpers({
  selectedOption () {
    const instance = Template.instance();

    return instance.selectedOption.get();
  },
});

Template.apiFilteredBy.events({
  'click .clear-all': () => {
    // Delete query parameter
    FlowRouter.setQueryParams({ lifecycle: null });
  },
});
