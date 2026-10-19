'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserProfile } from '@/features/profile/hooks/useUserProfile';
import {
  ProfileHeader,
  PersonalInfoSection,
  AccountSecuritySection,
  UserStoresSection,
} from '@/features/profile/components';
import PageLoader from '@/components/PageLoader';

export default function ProfilePage() {
  const router = useRouter();
  const {
    user,
    profileData,
    stores,
    loading,
    saving,
    sendingReset,
    sendingVerification,
    handleUpdateProfile,
    handleSendPasswordReset,
    handleSendVerification,
  } = useUserProfile();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  if (loading) {
    return <PageLoader message="Loading your profile..." />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen pb-16 pt-2 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto selection:bg-blue-500/20 antialiased">
      {/* ── Top Profile Header Banner ── */}
      <ProfileHeader user={user} profileData={profileData} />

      {/* ── Main Content Grid ── */}
      <div className="space-y-8">
        {/* 1. Personal Identity & Contact Information */}
        <PersonalInfoSection
          user={user}
          profileData={profileData}
          onUpdate={handleUpdateProfile}
          saving={saving}
        />

        {/* 2. Authentication, Provider & Security */}
        <AccountSecuritySection
          user={user}
          onSendPasswordReset={handleSendPasswordReset}
          onSendVerification={handleSendVerification}
          sendingReset={sendingReset}
          sendingVerification={sendingVerification}
        />

        {/* 3. Stores Affiliated With This Account */}
        <UserStoresSection stores={stores} />
      </div>
    </div>
  );
}
