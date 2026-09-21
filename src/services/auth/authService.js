import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import app from "../firebase/firebaseConfig";

const auth = getAuth(app);

const getStudentAuthEmail = (registrationId) =>
  `${registrationId.toLowerCase()}@students.apj-edu.com`;

export const createStudentAccount = async (
  registrationId,
  dateOfBirth
) => {
  const userCredential =
    await createUserWithEmailAndPassword(
      auth,
      getStudentAuthEmail(registrationId),
      dateOfBirth
    );

  return userCredential.user;
};

export const loginStudent = async (
  registrationId,
  dateOfBirth
) => {
  const userCredential =
    await signInWithEmailAndPassword(
      auth,
      getStudentAuthEmail(registrationId),
      dateOfBirth
    );

  return userCredential.user;
};

export const loginAdmin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const tokenResult =
      await userCredential.user.getIdTokenResult(true);

    if (tokenResult.claims.admin !== true) {
      await signOut(auth);

      const claimError = new Error(
        "This account is not configured as an admin."
      );

      claimError.code = "auth/admin-claim-required";
      throw claimError;
    }

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