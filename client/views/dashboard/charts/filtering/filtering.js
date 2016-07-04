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
})
