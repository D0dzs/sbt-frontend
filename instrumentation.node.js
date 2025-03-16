import { cookies } from 'next/headers';

const originalFetch = global.fetch;

global.fetch = async (url, options = {}) => {
  if (url.toString().includes(process.env.BACKEND_URL)) {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (token) {
      options.headers = {
        ...options.headers,
        Cookie: `token=${token}`,
      };
    }
  }

  return originalFetch(url, options);
};
