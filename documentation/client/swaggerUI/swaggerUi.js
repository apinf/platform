// APINF imports
import 'swagger-ui/dist/css/screen.css';

Template.swaggerUi.onCreated(() => {
  const instance = Template.instance();
  // Set flag on Data is not Ready
  instance.dataFetched = new ReactiveVar(false);

  // Get url of api documentation
  const documentationURL = instance.data.apiDoc;

  // Check validation of Swagger file
  Meteor.call('isValidSwagger', documentationURL, (error, result) => {
    // result can be 'true' or '{}'
    if (result === true) {
      // Save result in template instance
      instance.documentationValid = result;
    }
    // Set flag on Data is Ready
    instance.dataFetched.set(true);
  });
});

Template.swaggerUi.helpers({
  dataFetched () {
    const instance = Template.instance();
    // Get status of data is ready
    return instance.dataFetched.get();
  },
  documentationValid () {
    const instance = Template.instance();
    // Get status of api documentation is valid
    return instance.documentationValid;
  },
});
