import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));

try {
  const app = initializeApp({
     projectId: config.projectId,
     credential: applicationDefault()
  });
  const db = getFirestore(app, config.firestoreDatabaseId);
  const snapshot = await db.collection('test').limit(1).get();
  console.log("DB read success. Empty:", snapshot.empty);
} catch(e) {
  console.error("DB failed:", e);
}
