import { ApiBackends } from '/apis/collection/backend';

// Create indexes for fields in MongoDB collection (API backends search functionality)
ApiBackends._ensureIndex({
  "name": 1,
  "backend_host": 1
});
