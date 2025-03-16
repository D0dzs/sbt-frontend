'use client';

import { getCookie } from 'cookies-next';

export default async function clientFetch(url, options = {}) {
  const token = getCookie('token');

  const headers = {
    ...options.headers,
    credentials: 'include',
    Cookie: `token=${token}`,
  };

  return fetch(url, {
    ...options,
    headers,
  });
}
