'use client';

import { createContext, useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const logout = useCallback(async () => {
    const res = await fetch('http://localhost:8080/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });

    const ctx = await res.json();
    toast.success(ctx.message);
    router.replace(ctx.redirect, { scroll: true });
    setUser(null);
    setRefresh((prev) => !prev);
  }, [router]);

  const getUserInfo = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/auth/me', {
        method: 'GET',
        credentials: 'include',
      }).catch((error) => {
        throw error;
      });

      if (response.status === 401) {
        const refreshResponse = await fetch('http://localhost:8080/api/auth/refresh', {
          method: 'POST',
          credentials: 'include',
        });

        if (refreshResponse.ok) {
          const retryResponse = await fetch('http://localhost:8080/api/auth/me', {
            method: 'GET',
            credentials: 'include',
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
