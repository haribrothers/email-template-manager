import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

const adapter = new JSONFile('db.json');
const defaultData = {
  templates: [],
  variables: [],
  partials: []
};

export const db = new Low(adapter, defaultData);

// Initialize database
await db.read();
if (!db.data) {
  db.data = defaultData;
  await db.write();
}