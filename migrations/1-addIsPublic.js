import { ApiBackends } from '/apis/collection/backend';

Migrations.add({
  version: 1,
  name: 'Add isPublic field to all existing APIs.',
  up: function() {
    const apiBackends = ApiBackends.find().fetch();
    // Set all apiBackends visibility to true by default if undefined
    _.each(apiBackends, function(api){
      if(api.isPublic === undefined) {
        ApiBackends.update(api._id, {$set : {'isPublic': true}});
      }
    });
  }
});
