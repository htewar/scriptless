'use client'

import { useRouter } from 'next/navigation'
import LoginForm from "./lib/ui/components/loginForm";
import { useEffect, useState } from "react";
import { RoutePaths } from "./lib/utils/routes";
import Cookies from 'js-cookie';

export default function Home() {
  const router = useRouter()
  const [isLoading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const authToken = Cookies.get('authToken');
    if (authToken) {
      router.replace(RoutePaths.TestCases(""));
    }
  }, [router]);


  const handleLogin = (values: { username: string; password: string }) => {
    console.log("Login", values);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace(RoutePaths.Console);
    }, 1000);
    // if (values.username === "admin" && values.password === "admin") {
    //   setLoading(true);
    //   setTimeout(() => {
    //     const expirationDate = new Date(new Date().getTime() + 15 * 60 * 1000);
    //     // Cookies.set('authToken', 'authTokenValue', { expires: expirationDate });
    //     router.replace(RoutePaths.Console);
    //   }, 2000);
    //   return;
    // }
    // setLoading(true);
    // setTimeout(() => {
    //   setLoading(false);
    //   setErrorMessage("Invalid username or password");
    // }, 2000);
  };

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
