import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

import app from "../firebase/firebaseConfig";

const db = getFirestore(app);

// Add document
export const addData = async (collectionName, data) => {
  const collectionRef = collection(db, collectionName);
  const docRef = await addDoc(collectionRef, data);

  return docRef.id;
};

// Get all documents
export const getData = async (collectionName) => {
  const collectionRef = collection(db, collectionName);
  const snapshot = await getDocs(collectionRef);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
};

// Get one document
export const getSingleData = async (collectionName, documentId) => {
  const docRef = doc(db, collectionName, documentId);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
};

// Update document
export const updateData = async (
  collectionName,
  documentId,
  data
) => {
  const docRef = doc(db, collectionName, documentId);

  await updateDoc(docRef, data);
};

// Delete document
export const deleteData = async (
  collectionName,
  documentId
) => {
  const docRef = doc(db, collectionName, documentId);

  await deleteDoc(docRef);
};

export { db };