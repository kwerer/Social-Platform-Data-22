import admin from "firebase-admin";

import serviceAccount from "./serviceAccountKey.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// admin.initializeApp(firebaseConfig);
const db = admin.firestore();
const TiktokDataComments = db
  .collection("Tiktok Data")
  .doc("PostComments")
  .collection("IndividualPostComments");
const TiktokDataPost = db
  .collection("Tiktok Data")
  .doc("PostData")
  .collection("IndividualPostData");
const TiktokDataUserAccounts = db
  .collection("Tiktok Data")
  .doc("UserAccounts")
  .collection("IndividualUseraccounts");
export { TiktokDataComments, TiktokDataPost, TiktokDataUserAccounts, db };
