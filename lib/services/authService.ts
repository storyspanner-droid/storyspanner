import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  deleteUser,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth';
import { doc, setDoc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import auth from '@/lib/firebase/auth';
import db from '@/lib/firebase/firestore';
import { Category, SocialProvider } from '@/lib/types';
import { getUserByUserId } from './userService';

interface SignUpOptions {
  userId: string;
  name: string;
  nickname: string;
  phone: string;
  birthDate: string;
  interests: Category[];
  agreedToMarketing: boolean;
}

export async function signUpWithEmail(
  email: string,
  password: string,
  options: SignUpOptions
): Promise<void> {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  await setDoc(doc(db, 'users', user.uid), {
    id: user.uid,
    userId: options.userId,
    email,
    name: options.name,
    nickname: options.nickname,
    phone: options.phone,
    birthDate: options.birthDate,
    level: 1,
    status: 'active',
    provider: 'email' as SocialProvider,
    interests: options.interests,
    points: 0,
    postCount: 0,
    commentCount: 0,
    followerCount: 0,
    followingCount: 0,
    agreedToPrivacy: true,
    agreedToMarketing: options.agreedToMarketing,
    lastActiveAt: serverTimestamp(),
    createdAt: serverTimestamp(),
  });
}

export async function signInWithUserId(userId: string, password: string): Promise<void> {
  const user = await getUserByUserId(userId);
  if (!user) throw { code: 'auth/user-not-found' };
  await signInWithEmailAndPassword(auth, user.email, password);
}

export async function signInWithGoogle(): Promise<void> {
  const provider = new GoogleAuthProvider();
  const { user } = await signInWithPopup(auth, provider);
  const snap = await getDoc(doc(db, 'users', user.uid));
  if (!snap.exists()) {
    await setDoc(doc(db, 'users', user.uid), {
      id: user.uid,
      userId: `google_${user.uid.slice(0, 8)}`,
      email: user.email ?? '',
      name: user.displayName ?? '',
      nickname: user.displayName ?? '유저',
      phone: '',
      birthDate: '',
      level: 1,
      status: 'active',
      provider: 'google' as SocialProvider,
      interests: [],
      points: 0,
      postCount: 0,
      commentCount: 0,
      followerCount: 0,
      followingCount: 0,
      agreedToPrivacy: true,
      agreedToMarketing: false,
      lastActiveAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    });
  }
}

export async function sendPasswordReset(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error('로그인이 필요합니다.');
  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);
  await updatePassword(user, newPassword);
}

export async function withdrawAccount(password: string): Promise<void> {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error('로그인이 필요합니다.');
  const credential = EmailAuthProvider.credential(user.email, password);
  await reauthenticateWithCredential(user, credential);
  await updateDoc(doc(db, 'users', user.uid), { status: 'withdrawn' });
  await deleteUser(user);
}
