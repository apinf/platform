import { Apis } from '../';

// Create indexes for fields in MongoDB collection (API backends search functionality)
Apis._ensureIndex({
  "name": 1,
  "backend_host": 1
});
