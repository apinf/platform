import { RssFeed } from 'meteor/raix:rssfeed';
// import { FlowRouter } from 'meteor/kadira:flow-router';

// import Organizations from '/organizations/collection';
import Apis from '/apis/collection';
import OrganizationApis from '../';


RssFeed.publish('apis', function () {
  const feed = this;
  OrganizationApis.find().forEach((organizationApi) => {
    const apiOrganizationId = organizationApi.apiId;
    const api = Apis.findOne({ _id: apiOrganizationId });
    feed.addItem({
      title: api.name,
      description: api.description,
      // link: 'FlowRouter.go(\'/\')apis/api.name',
      pubDate: api.created_at,
    });
  });
});
