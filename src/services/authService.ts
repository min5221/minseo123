import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
}

const LOCAL_USER_KEY = 'haru_logged_in_user';
const LOCAL_USERS_DB_KEY = 'haru_registered_users_db';

/**
 * Helper to save local fallback user database
 */
function getLocalUsersDb(): Record<string, { email: string; displayName: string; passHash: string }> {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_USERS_DB_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveLocalUsersDb(dbRecord: Record<string, { email: string; displayName: string; passHash: string }>) {
  try {
    localStorage.setItem(LOCAL_USERS_DB_KEY, JSON.stringify(dbRecord));
  } catch {
    // ignore
  }
}

/**
 * Simple hashing for local fallback storage (not sensitive)
 */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash.toString();
}

/**
 * Register with Email and Password
 */
export async function registerWithEmail(
  name: string,
  email: string,
  password: string
): Promise<AppUser> {
  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();

  // Validate name
  if (!cleanName) {
    throw new Error('성함(이름)을 입력해 주세요.');
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    throw new Error('이메일 주소를 올바른 형식으로 입력해 주세요. (예: user@example.com)');
  }

  // Validate password length >= 6
  if (!password || password.length < 6) {
    throw new Error('비밀번호는 최소 6자 이상이어야 합니다. 6자리 이상으로 설정해 주세요.');
  }

  try {
    // 1. Try Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
    const fbUser = userCredential.user;

    // Update Firebase display name
    await updateProfile(fbUser, { displayName: cleanName });

    // Store in Firestore users collection
    try {
      await setDoc(doc(db, 'users', fbUser.uid), {
        userId: fbUser.uid,
        email: cleanEmail,
        displayName: cleanName,
        createdAt: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Firestore user save warning:', e);
    }

    const appUser: AppUser = {
      uid: fbUser.uid,
      email: cleanEmail,
      displayName: cleanName,
    };

    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(appUser));
    return appUser;
  } catch (err: any) {
    console.warn('Firebase Auth register error:', err?.code, err?.message);

    // If email already in use
    if (err?.code === 'auth/email-already-in-use') {
      throw new Error('이미 가입된 이메일 주소입니다. 로그인해 주세요.');
    }

    // If weak password
    if (err?.code === 'auth/weak-password') {
      throw new Error('비밀번호가 너무 짧거나 취약합니다. 6자 이상으로 입력해 주세요.');
    }

    // If invalid email
    if (err?.code === 'auth/invalid-email') {
      throw new Error('유효하지 않은 이메일 형식입니다.');
    }

    // If Firebase Auth Email/Password provider is not enabled in Firebase Console, use fallback
    if (err?.code === 'auth/operation-not-allowed' || err?.code === 'auth/network-request-failed') {
      const localDb = getLocalUsersDb();
      if (localDb[cleanEmail]) {
        throw new Error('이미 가입된 이메일 주소입니다. 로그인해 주세요.');
      }

      const uid = 'usr_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
      localDb[cleanEmail] = {
        email: cleanEmail,
        displayName: cleanName,
        passHash: simpleHash(password),
      };
      saveLocalUsersDb(localDb);

      const appUser: AppUser = {
        uid,
        email: cleanEmail,
        displayName: cleanName,
      };

      try {
        await setDoc(doc(db, 'users', uid), {
          userId: uid,
          email: cleanEmail,
          displayName: cleanName,
          createdAt: new Date().toISOString(),
        });
      } catch (fsErr) {
        // ignore
      }

      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(appUser));
      return appUser;
    }

    throw new Error(err.message || '회원가입 처리 중 오류가 발생했습니다.');
  }
}

/**
 * Login with Email and Password
 */
export async function loginWithEmail(email: string, password: string): Promise<AppUser> {
  const cleanEmail = email.trim().toLowerCase();

  // Validate email
  if (!cleanEmail) {
    throw new Error('이메일을 입력해 주세요.');
  }

  // Validate password
  if (!password) {
    throw new Error('비밀번호를 입력해 주세요.');
  }

  if (password.length < 6) {
    throw new Error('비밀번호는 6자 이상이어야 합니다. 입력하신 비밀번호를 확인해 주세요.');
  }

  try {
    // 1. Try Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
    const fbUser = userCredential.user;

    // Check display name from user or Firestore
    let name = fbUser.displayName || '';
    if (!name) {
      try {
        const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
        if (userDoc.exists()) {
          name = userDoc.data().displayName || '';
        }
      } catch {
        // ignore
      }
    }

    if (!name) {
      name = cleanEmail.split('@')[0];
    }

    const appUser: AppUser = {
      uid: fbUser.uid,
      email: cleanEmail,
      displayName: name,
    };

    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(appUser));
    return appUser;
  } catch (err: any) {
    console.warn('Firebase Auth login error:', err?.code, err?.message);

    // Friendly Korean error messages for passwords and accounts
    if (
      err?.code === 'auth/wrong-password' ||
      err?.code === 'auth/invalid-credential' ||
      err?.code === 'auth/invalid-login-credentials'
    ) {
      throw new Error('비밀번호가 일치하지 않습니다. 비밀번호(6자 이상)를 다시 확인해 주세요.');
    }

    if (err?.code === 'auth/user-not-found') {
      throw new Error('가입되지 않은 이메일 주소입니다. [회원가입]을 먼저 진행해 주세요.');
    }

    if (err?.code === 'auth/invalid-email') {
      throw new Error('이메일 형식이 올바르지 않습니다.');
    }

    if (err?.code === 'auth/too-many-requests') {
      throw new Error('로그인 시도가 너무 많아 일시적으로 차단되었습니다. 잠시 후 다시 시도해 주세요.');
    }

    // If operation not allowed or offline, check local fallback
    if (err?.code === 'auth/operation-not-allowed' || err?.code === 'auth/network-request-failed') {
      const localDb = getLocalUsersDb();
      const userRecord = localDb[cleanEmail];
      if (!userRecord) {
        throw new Error('가입되지 않은 이메일입니다. [회원가입]을 먼저 진행해 주세요.');
      }
      if (userRecord.passHash !== simpleHash(password)) {
        throw new Error('비밀번호가 일치하지 않습니다. 다시 확인해 주세요.');
      }

      const appUser: AppUser = {
        uid: 'usr_' + cleanEmail,
        email: cleanEmail,
        displayName: userRecord.displayName,
      };

      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(appUser));
      return appUser;
    }

    throw new Error('로그인에 실패했습니다: ' + (err.message || '잠시 후 다시 시도해 주세요.'));
  }
}

/**
 * Logout
 */
export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (e) {
    // ignore
  }
  localStorage.removeItem(LOCAL_USER_KEY);
}

/**
 * Get current logged in user from localStorage or Firebase Auth
 */
export function getSavedUser(): AppUser | null {
  try {
    const raw = localStorage.getItem(LOCAL_USER_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  return null;
}
