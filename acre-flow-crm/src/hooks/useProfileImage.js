import { useEffect, useState } from 'react';
import { apiUrl } from '@/config/apiConfig';

const useProfileImage = () => {
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProfileImage = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const cacheBuster = Date.now();
        const response = await fetch(`${apiUrl}/api/users/me?_cb=${cacheBuster}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Cache-Control': 'no-cache'
          }
        });

        if (!response.ok) return;

        const result = await response.json();
        const image = result?.data?.profileImage || null;
        if (isMounted) {
          setProfileImage(image);
        }
      } catch (error) {
        // silent fallback to default avatar
      }
    };

    const handleRefresh = () => {
      fetchProfileImage();
    };

    fetchProfileImage();
    window.addEventListener('profile-image-updated', handleRefresh);

    return () => {
      isMounted = false;
      window.removeEventListener('profile-image-updated', handleRefresh);
    };
  }, []);

  return profileImage;
};

export default useProfileImage;
