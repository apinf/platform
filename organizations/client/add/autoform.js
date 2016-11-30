import { AutoForm } from 'meteor/aldeed:autoform';
import { FlowRouter } from 'meteor/kadira:flow-router';

AutoForm.hooks({
  addOrganizationForm: {
    onSuccess () {
      // Get reference to template instance
      const instance = this;

      // Get slug
      const slug = instance.insertDoc.slug;

      // Redirect to newly added API
      FlowRouter.go('singleOrganization', { slug });
    },
  },
});
