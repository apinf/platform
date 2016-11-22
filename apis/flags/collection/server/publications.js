Meteor.publish('singleApiFlag', (apiBackendId) => {

  // Fetch api flag by apibackend id
  const flag = ApiFlags.find({ apiBackendId });

  return flag;
});
