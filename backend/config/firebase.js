import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;

let adminAuth = null;

if (serviceAccount) {
  const app = getApps().length
    ? getApps()[0]
    : initializeApp({ credential: cert(JSON.parse(serviceAccount)) });
  adminAuth = getAuth(app);
}

export { adminAuth };
export const isAdminConfigured = Boolean(serviceAccount);
