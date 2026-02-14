import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider } from '@/config/firebase';
import { apiPost } from '@/servies/api';

export async function signUpWithEmail({ name, email, password }) {
  // Create user in Firebase
  const credential = await createUserWithEmailAndPassword(auth, email, password);

  if (name) {
    await updateProfile(credential.user, { displayName: name });
  }

  // Get Firebase ID token
  const token = await credential.user.getIdToken();
  
  // Store token in localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token);
  }

  // Register user in MongoDB via backend
  try {
    await apiPost('/auth/register');
  } catch (error) {
    console.error('Failed to register user in database:', error);
    // Note: User is already created in Firebase, so we don't throw here
    // The login will handle creating the user if it doesn't exist
  }

  return credential.user;
}

export async function loginWithEmail({ email, password }) {
  // Sign in with Firebase
  const credential = await signInWithEmailAndPassword(auth, email, password);
  
  // Get Firebase ID token
  const token = await credential.user.getIdToken();
  
  // Store token in localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token);
  }

  // Login/sync user in MongoDB via backend
  try {
    await apiPost('/auth/login');
  } catch (error) {
    console.error('Failed to login user in database:', error);
    // If user doesn't exist in DB, try to register them
    if (error.message?.includes('not found') || error.success === false) {
      try {
        await apiPost('/auth/register');
      } catch (registerError) {
        console.error('Failed to register user in database:', registerError);
      }
    }
  }

  return credential.user;
}

export async function loginWithGoogle() {
  // Sign in with Google popup
  const credential = await signInWithPopup(auth, googleProvider);
  
  // Get Firebase ID token
  const token = await credential.user.getIdToken();
  
  // Store token in localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token);
  }

  // Try to login first, if user doesn't exist, register them
  try {
    await apiPost('/auth/login');
  } catch (error) {
    console.error('Failed to login user in database:', error);
    // If user doesn't exist in DB, register them
    if (error.message?.includes('not found') || error.success === false) {
      try {
        await apiPost('/auth/register');
      } catch (registerError) {
        console.error('Failed to register user in database:', registerError);
      }
    }
  }

  return credential.user;
}

export function logoutUser() {
  return signOut(auth);
}

const AUTH_MESSAGES = {
  'auth/email-already-in-use': 'This email is already registered.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/invalid-credential': 'Invalid email or password.',
  'auth/user-not-found': 'No user was found with this email.',
  'auth/wrong-password': 'Incorrect password.',
  'auth/weak-password': 'Password must be at least 6 characters.',
  'auth/popup-closed-by-user': 'Google sign-in popup was closed before completing.',
};

export function getAuthErrorMessage(error) {
  if (!error || !error.code) {
    return 'Authentication failed. Please try again.';
  }

  return AUTH_MESSAGES[error.code] || 'Authentication failed. Please try again.';
}
