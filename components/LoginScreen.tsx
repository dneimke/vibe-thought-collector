import React, { useEffect } from 'react';
import { BrainCircuitIcon } from './icons';
import { signInWithGoogle, getGoogleRedirectResult } from '../services/firebase';

const LoginScreen: React.FC = () => {

  useEffect(() => {
    const checkRedirect = async () => {
      try {
        await getGoogleRedirectResult();
        // Successful redirect login is handled by onAuthStateChanged in App.tsx
      } catch (error: any) {
        console.error("Error handling redirect login", error);
        if (error.code === 'auth/unauthorized-domain') {
          const inIframe = window.self !== window.top;
          let message = "Sign-in Error: This domain is not authorized for authentication.\n\n" +
            "To fix this, please follow these steps:\n" +
            "1. Go to your Firebase Console.\n" +
            "2. Navigate to Authentication > Settings > Authorized domains.\n" +
            "3. Click 'Add domain' and add: " + window.location.hostname;
          
          alert(message);
        } else {
          // Ignore null errors which mean no redirect happened
          if (error) alert("Login failed: " + error.message);
        }
      }
    };
    
    checkRedirect();
  }, []);

  const handleSignIn = async () => {
    console.log("Initiating Google Sign In...");
    try {
      await signInWithGoogle();
      console.log("Sign in redirect initiated");
    } catch (error: any) {
      console.error("Error signing in with Google", error);
      alert(`Login Error: ${error.message} (${error.code})`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="text-center max-w-lg">
        <div className="flex items-center justify-center gap-4 mb-4">
          <BrainCircuitIcon className="w-12 h-12 text-cyan-400" />
          <h1 className="text-5xl font-bold tracking-tight">
            Thought Collector
          </h1>
        </div>
        <p className="text-xl text-gray-400 mb-8">
          Your personal AI-powered idea vault. Sign in to capture, organize, and rediscover your thoughts from any device.
        </p>
        <button
          onClick={handleSignIn}
          className="bg-white text-gray-800 font-semibold py-3 px-6 rounded-lg flex items-center justify-center mx-auto transition-transform hover:scale-105"
        >
          <svg className="w-6 h-6 mr-3" viewBox="0 0 48 48">
            <path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
            <path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.96 7.27l7.47 5.8c4.4-4.04 6.93-10.09 6.93-17.54z"></path>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
            <path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.47-5.8c-2.15 1.45-4.96 2.3-8.42 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
            <path fill="none" d="M0 0h48v48H0z"></path>
          </svg>
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default LoginScreen;