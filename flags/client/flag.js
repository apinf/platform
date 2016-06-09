Template.flagApiModal.helpers({
  formType () {

    const instance = Template.instance();
    const apiFlag = instance.data.apiFlag;

    return (apiFlag) ? 'update' : 'insert';
  },
  apiFlag () {

    const instance = Template.instance();

    const apiFlag = instance.data.apiFlag;

    return apiFlag;

  }
})
