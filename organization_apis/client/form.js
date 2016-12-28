import { Template } from 'meteor/templating';
import { OrganizationApis } from '../collection';

Template.organizationApis.helpers({
  organizationApisCollection () {
    return OrganizationApis;
  },
  organizationApisDoc () {
    let organizationApisDoc;
    // Get data context
    const organizationId = Template.currentData().organizationId;
    const apiId = Template.currentData().apiId;

    // Check if organizationId is passed
    if (organizationId) {
      organizationApisDoc = OrganizationApis.findOne({ organizationId });
    // Check if apiId is passed
    } else if (apiId) {
      organizationApisDoc = OrganizationApis.findOne({ apiIds: { $in: [apiId] } });
    }
    return organizationApisDoc;
  },
  organizationOptions () {
    return [
        { label: '2013', value: 2013 },
        { label: '2014', value: 2014 },
        { label: '2015', value: 2015 },
    ];
  },
  apiOptions () {
    return [
        { label: '2013', value: 2013 },
        { label: '2014', value: 2014 },
        { label: '2015', value: 2015 },
    ];
  },
});
