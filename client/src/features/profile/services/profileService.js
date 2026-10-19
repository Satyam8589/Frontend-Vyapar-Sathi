import { apiGet, apiPut } from '@/servies/api';

/**
 * Fetch current authenticated user's profile from backend
 */
export async function fetchUserProfile() {
  try {
    const res = await apiGet('/auth/profile');
    return res?.user || res?.data || res;
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    throw error;
  }
}

/**
 * Update current user's profile details
 */
export async function updateUserProfile(data) {
  try {
    const res = await apiPut('/auth/profile', data);
    return res?.user || res?.data || res;
  } catch (error) {
    console.error('Failed to update user profile:', error);
    throw error;
  }
}
