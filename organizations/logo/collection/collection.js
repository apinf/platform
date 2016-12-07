import { FileCollection } from 'meteor/vsivsi:file-collection';

const OrganizationLogo = new FileCollection('OrganizationLogo', {
  resumable: true,
  resumableIndexName: 'organizationlogo',
  http: [
    {
      method: 'get',
      path: '/md5/:md5',
      lookup: function (params) {
        return {
          md5: params.md5,
        };
      },
    },
  ],
});

export { OrganizationLogo };
