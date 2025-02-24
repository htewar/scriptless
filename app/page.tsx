"use client"

import { useRouter } from 'next/navigation'
import LoginForm from "./lib/ui/components/loginForm";
import { useEffect, useState } from "react";
import { apiClient } from './lib/api/apiClient';
import { RoutePaths } from './lib/utils/routes';
import Cookies from 'js-cookie';

export default function Home() {
  const router = useRouter()
  const [isLoading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const authToken = Cookies.get('authToken');
    if (authToken) {
      router.push(RoutePaths.Console);
    }
  }, [router])

  const handleLogin = async (values: { username: string; password: string }) => {
    setLoading(true);
    if (values.username === '' || values.password === '') {
      setErrorMessage('Please enter username and password');
      setLoading(false);
      return;
    }
    await authenticUser(values.username, values.password);
  };

  async function authenticUser(username: string, password: string) {
    try {
      const loginResponse = await apiClient.login(username, password);
      console.log(loginResponse);
      if (loginResponse.isUserAuthenticated) {
        const token = loginResponse.user?.token;
        if (token) {
          const expirationDate = new Date(new Date().getTime() + 60 * 60 * 1000);
          Cookies.set('authToken', token, { expires: expirationDate });
          Cookies.set('uid', loginResponse.user?.uid || "", { expires: expirationDate });
        }
        router.push(RoutePaths.Console);
      } else {
        setErrorMessage(loginResponse.errorMessage ? loginResponse.errorMessage : 'Failed to login. Please try again.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setErrorMessage('Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
      <div>
        <LoginForm
            onSubmitForm={handleLogin}
            isLoading={isLoading}
            errorMessage={errorMessage}
            onFormDataUpdate={() => { setErrorMessage(null) }}
        />
      </div>
  );
}

