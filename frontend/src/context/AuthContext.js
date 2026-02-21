import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp, increment } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase/config';


const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const createUserProfile = async (uid, data) => {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, {
        ...data,
        createdAt: serverTimestamp(),
        totalVisits: 1,
        moodHistory: [],
        streak: 0,
        lastVisit: serverTimestamp(),
        favoriteEmoji: '🌈',
        bio: '',
        achievements: []
      });
    } else {
      await updateDoc(userRef, {
        totalVisits: increment(1),
        lastVisit: serverTimestamp()
      });
    }
    const updated = await getDoc(userRef);
    return updated.data();
  };

  const register = async (email, password, displayName) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName });
    const profile = await createUserProfile(result.user.uid, {
      displayName,
      email,
      photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`,
    });
    setUserProfile(profile);
    return result;
  };

  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const profile = await createUserProfile(result.user.uid, {
      displayName: result.user.displayName || email.split('@')[0],
      email: result.user.email,
      photoURL: result.user.photoURL,
    });
    setUserProfile(profile);
    return result;
  };

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const profile = await createUserProfile(result.user.uid, {
      displayName: result.user.displayName,
      email: result.user.email,
      photoURL: result.user.photoURL,
    });
    setUserProfile(profile);
    return result;
  };

  const logout = () => signOut(auth);

  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  const updateMoodHistory = async (mood) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data();
      const history = data.moodHistory || [];
      const newEntry = { mood, timestamp: new Date().toISOString(), date: new Date().toDateString() };
      const updatedHistory = [newEntry, ...history].slice(0, 50);

      // Calculate streak
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      const lastEntry = history[0];
      let streak = data.streak || 0;
      if (!lastEntry || lastEntry.date !== today) {
        streak = lastEntry && lastEntry.date === yesterday ? streak + 1 : 1;
      }

      await updateDoc(userRef, { moodHistory: updatedHistory, streak });
      setUserProfile(prev => ({ ...prev, moodHistory: updatedHistory, streak }));
    }
  };

  const updateUserProfile = async (updates) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, updates);
    setUserProfile(prev => ({ ...prev, ...updates }));
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const userRef = doc(db, 'users', firebaseUser.uid);
          const snap = await getDoc(userRef);
          if (snap.exists()) setUserProfile(snap.data());
          else {
            const profile = await createUserProfile(firebaseUser.uid, {
              displayName: firebaseUser.displayName || 'Mood User',
              email: firebaseUser.email,
              photoURL: firebaseUser.photoURL,
            });
            setUserProfile(profile);
          }
        } catch (e) { console.error('Profile fetch error:', e); }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const value = { user, userProfile, loading, register, login, loginWithGoogle, logout, resetPassword, updateMoodHistory, updateUserProfile };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
