import { Apis } from '/apis/collection/apis';

// Create indexes for fields in MongoDB collection (API backends search functionality)
Apis._ensureIndex({
  "name": 1,
  "url": 1
});
