import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));

try {
  const app = admin.initializeApp({
     projectId: config.projectId,
     credential: admin.credential.applicationDefault()
  });
  const db = getFirestore(app);
  db.settings({ databaseId: config.firestoreDatabaseId });
  const snapshot = await db.collection('test').limit(1).get();
  console.log("DB read success. Empty:", snapshot.empty);
} catch(e) {
  console.error("DB failed:", e);
}
