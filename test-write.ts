import { db } from './src/lib/firebase.js';
import { collection, addDoc } from 'firebase/firestore';

async function test() {
  try {
    const docRef = await addDoc(collection(db, 'whatsapp_messages'), { test: true });
    console.log("Success: ", docRef.id);
  } catch(e) {
    console.error("Error: ", e);
  }
}
test();
