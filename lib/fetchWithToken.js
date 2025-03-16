'use client';

import Cookies from "js-cookie";

export default async function clientFetch(url, options = {}) {
  const token = Cookies.get('token')

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
