import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import app from "../firebase/firebaseConfig";

const auth = getAuth(app);

export const loginAdmin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const logoutAdmin = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

export { auth };