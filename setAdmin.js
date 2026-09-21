import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import fs from "fs";

const serviceAccount = JSON.parse(
  fs.readFileSync("./serviceAccountKey.json", "utf8")
);

const app = initializeApp({
  credential: cert(serviceAccount),
});

const auth = getAuth(app);

const uid = "5JVtN9GAADRRIFAuK2i4c9sWtos2";

try {
  await auth.setCustomUserClaims(uid, {
    admin: true,
  });

  const user = await auth.getUser(uid);

  console.log("");
  console.log("======================================");
  console.log("ADMIN CLAIM ADDED SUCCESSFULLY");
  console.log("======================================");
  console.log("Email:", user.email);
  console.log("UID:", user.uid);
  console.log("Claims:", user.customClaims);
  console.log("======================================");
  console.log("");
} catch (error) {
  console.error("");
  console.error("FAILED TO ADD ADMIN CLAIM");
  console.error(error);
  console.error("");
  process.exitCode = 1;
}
