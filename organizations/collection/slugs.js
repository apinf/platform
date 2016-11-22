import { Organizations } from './';

Organizations.friendlySlugs({
  slugFrom: 'name',
  slugField: 'slug',
  createOnUpdate: true,
  distinct: true,
});
