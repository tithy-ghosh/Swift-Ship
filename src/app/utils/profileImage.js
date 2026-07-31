const bufferToBase64 = (bytes) => {
  let binary = '';
  const chunkSize = 0x8000;

  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.slice(index, index + chunkSize));
  }

  return btoa(binary);
};

const API_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');

/** Converts API image values into safe browser image sources. */
export const getProfileImageSource = (photoURL) => {
  if (!photoURL) return '';

  if (typeof photoURL === 'string') {
    const value = photoURL.trim();
    if (/^(data:image\/|https?:\/\/)/i.test(value)) return value;
    if (value.startsWith('/') && API_URL) return `${API_URL}${value}`;
    if (/^(uploads|images)\//i.test(value) && API_URL) return `${API_URL}/${value}`;
    if (/^[A-Za-z0-9+/]+={0,2}$/.test(value)) return `data:image/jpeg;base64,${value}`;
    return '';
  }

  const bytes = photoURL?.type === 'Buffer'
    ? photoURL.data
    : photoURL?.data?.type === 'Buffer'
      ? photoURL.data.data
      : null;

  if (!Array.isArray(bytes)) return '';
  return `data:image/jpeg;base64,${bufferToBase64(bytes)}`;
};

/** Reads profile image fields used by common backend schemas. */
export const getProfilePhoto = (profile) => (
  profile?.photoURL
  || profile?.photoUrl
  || profile?.profilePicture
  || profile?.avatar
  || profile?.image
  || ''
);
