import admin from 'firebase-admin';
try {
  admin.initializeApp();
  console.log("Admin init success");
} catch(e) {
  console.error("Admin init failed:", e.message);
}
