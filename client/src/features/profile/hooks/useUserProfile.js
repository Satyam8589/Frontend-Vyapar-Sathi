'use client';

import { useState, useEffect, useCallback } from 'react';
import { updateProfile, sendPasswordResetEmail, sendEmailVerification } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { useAuthContext } from '@/features/auth/context/AuthContext';
import { fetchUserProfile, updateUserProfile } from '../services/profileService';
import { apiGet } from '@/servies/api';
import toast from 'react-hot-toast';

export function useUserProfile() {
  const { user, isLoading: authLoading } = useAuthContext();
  const [profileData, setProfileData] = useState(null);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sendingReset, setSendingReset] = useState(false);
  const [sendingVerification, setSendingVerification] = useState(false);

  const loadData = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);

      // Fetch profile from backend
      try {
        const pData = await fetchUserProfile();
        setProfileData(pData);
      } catch (err) {
        console.warn('Backend profile not found or failed, using Firebase profile:', err);
      }

      // Fetch user stores
      try {
        const storeRes = await apiGet('/store/all');
        const storesList = Array.isArray(storeRes?.stores)
          ? storeRes.stores
          : Array.isArray(storeRes)
          ? storeRes
          : [];
        setStores(storesList);
      } catch (storeErr) {
        console.warn('Failed to load stores for profile overview:', storeErr);
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && user) {
      loadData();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [authLoading, user, loadData]);

  // Update Name & Phone
  const handleUpdateProfile = async ({ name, phone }) => {
    setSaving(true);
    try {
      // 1. Update Firebase display name if changed
      if (auth.currentUser && name && name !== auth.currentUser.displayName) {
        await updateProfile(auth.currentUser, { displayName: name });
      }

      // 2. Update Backend
      const updated = await updateUserProfile({ name, phone });
      setProfileData((prev) => ({
        ...prev,
        ...updated,
        name: name || prev?.name,
        phone: phone !== undefined ? phone : prev?.phone,
      }));

      toast.success('Profile updated successfully!');
      return true;
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error(error.message || 'Failed to update profile. Please try again.');
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Send Password Reset
  const handleSendPasswordReset = async () => {
    if (!user?.email) {
      toast.error('No email associated with this account');
      return;
    }

    setSendingReset(true);
    try {
      await sendPasswordResetEmail(auth, user.email);
      toast.success(`Password reset email sent to ${user.email}`);
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error(error.message || 'Failed to send password reset email');
    } finally {
      setSendingReset(false);
    }
  };

  // Send Email Verification
  const handleSendVerification = async () => {
    if (!auth.currentUser) return;
    setSendingVerification(true);
    try {
      await sendEmailVerification(auth.currentUser);
      toast.success(`Verification link sent to ${user.email}`);
    } catch (error) {
      console.error('Email verification error:', error);
      toast.error(error.message || 'Failed to send verification email');
    } finally {
      setSendingVerification(false);
    }
  };

  return {
    user,
    profileData,
    stores,
    loading: authLoading || loading,
    saving,
    sendingReset,
    sendingVerification,
    handleUpdateProfile,
    handleSendPasswordReset,
    handleSendVerification,
    refreshProfile: loadData,
  };
}
