'use client';

import { useRouter } from 'next/navigation';
import { createContext, useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import clientFetch from '~/lib/fetchWithToken';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const logout = useCallback(async () => {
    const res = await clientFetch(`${process.env.BACKEND_URL}/api/auth/logout`, {
      method: 'POST',
    });

    const ctx = await res.json();
    toast.success(ctx.message);
    setUser(null);
    setRefresh((prev) => !prev);
    router.push('/');
  }, [router]);

  const getUserInfo = useCallback(async () => {
    setLoading(true);

    try {
      const response = await clientFetch(`${process.env.BACKEND_URL}/api/auth/me`, {
        method: 'GET',
      }).catch((error) => {
        throw error;
      });

      if (response.status === 401) {
        const refreshResponse = await clientFetch(`${process.env.BACKEND_URL}/api/auth/refresh`, {
          method: 'POST',
        });

        if (refreshResponse.ok) {
          const retryResponse = await clientFetch(`${process.env.BACKEND_URL}/api/auth/me`, {
            method: 'GET',
          });

          if (retryResponse.ok) {
            const { user } = await retryResponse.json();
            setUser(user);
          }
        }
      } else {
        const { user } = await response.json();
        setUser(user);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getUserInfo();
  }, [getUserInfo, refresh]);

  return <UserContext.Provider value={{ user, logout, refresh, setRefresh, loading }}>{children}</UserContext.Provider>;
};
