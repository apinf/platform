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

    return instance.apis.get()
  }
});

Template.filtering.events({
  'change #filtering-form': function (event) {

    event.preventDefault();

    const instance = Template.instance();

    const api = $('#api-backend-id').val();

    Session.set('apiBackendId', api);

    console.log('filtered')
  }
})
