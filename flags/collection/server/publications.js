Meteor.publish('singleApiFlag', (apiBackendId) => {

  const flag = ApiFlags.find({ apiBackendId });

  return flag;
});
