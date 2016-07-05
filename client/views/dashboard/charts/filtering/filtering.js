import { ApiBackends } from '/apis/collection/backend';

Template.filtering.onCreated(function () {

  const instance = this;

  instance.apis = new ReactiveVar();

  instance.subscribe('myManagedApis');

  instance.autorun(() => {
    if (instance.subscriptionsReady()) {
      instance.apis.set(ApiBackends.find().fetch())
    }
  });
});

Template.filtering.helpers({
  apis () {
    const instance = Template.instance();

    console.log(instance.apis.get())

    return instance.apis.get();
  },
  selectedApi (apiId) {

    const apiBackendId = Session.get('apiBackendId');

    return (apiId === apiBackendId) ? 'selected' : '';
  }
});

Template.filtering.events({
  'change #filtering-form': function (event) {

    event.preventDefault();

    const instance = Template.instance();

    const apiFrontendPrefix = $('#api-frontend-prefix').val();

    Session.set('apiFrontendPrefix', apiFrontendPrefix);
  }
})
