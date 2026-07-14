import React from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import Pricing from "./Pricing";
import Navbar from "@/components/landing/Navbar";

const Login: React.FC = () => {
  const { login, user, isAdmin, loading } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/console";

  // If already logged in as admin, redirect
  if (user && isAdmin) {
    return <Navigate to={from} replace />;
  }

  return (
    <>
      <Navbar />
      <div className="fixed inset-0 z-0 h-screen overflow-hidden pointer-events-none select-none">
        <div className="absolute inset-0 z-50 bg-background/90" />
        <Pricing />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center p-4 font-sans text-foreground">
      <motion.div
        initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.8, ease: [0.21, 0.6, 0.35, 1] }}
        className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl bg-white border border-line-soft p-8 sm:p-10 shadow-2xl"
      >
        <div className="mb-10 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 140, damping: 15, delay: 0.1 }}
            className="mx-auto mb-6 flex justify-center"
          >
            <img src="/logo.png" alt="XyphX Logo" className="h-24 w-auto object-contain" />
          </motion.div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-carbon">Welcome Back</h1>
          <p className="mt-2.5 text-sm text-carbon/60">Sign in to your XyphX account</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => login()}
            disabled={loading}
            className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl border border-line-soft bg-background px-6 py-4 font-semibold text-carbon shadow-sm transition-all duration-300 hover:border-carbon/30 hover:shadow-md hover:bg-paper active:scale-[0.98] disabled:opacity-50"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          <button
            onClick={() => login()}
            disabled={loading}
            className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl border border-line-soft bg-background px-6 py-4 font-semibold text-carbon shadow-sm transition-all duration-300 hover:border-carbon/30 hover:shadow-md hover:bg-paper active:scale-[0.98] disabled:opacity-50"
          >
            <svg className="h-5 w-5" viewBox="0 0 21 21">
              <path fill="#f25022" d="M1 1h9v9H1z"/>
              <path fill="#7fba00" d="M11 1h9v9h-9z"/>
              <path fill="#00a4ef" d="M1 11h9v9H1z"/>
              <path fill="#ffb900" d="M11 11h9v9h-9z"/>
            </svg>
            Continue with Microsoft
          </button>

          <button
            onClick={() => login()}
            disabled={loading}
            className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl border border-line-soft bg-background px-6 py-4 font-semibold text-carbon shadow-sm transition-all duration-300 hover:border-carbon/30 hover:shadow-md hover:bg-paper active:scale-[0.98] disabled:opacity-50"
          >
            <svg className="h-5 w-5 text-[#6001D2]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.8 6.4L13.7 13.9C13.5 14.2 13.5 14.6 13.7 14.9L16.2 18.7H11.2L9.2 14.9C9 14.6 8.5 14.6 8.3 14.9L3.2 22.4H7.8L10.3 18.7L12.3 22.4H19.7L13.7 13.4L18.8 6.4Z"/>
              <path d="M20.8 1.6L14.8 10.6L12.8 6.9C12.6 6.6 12.1 6.6 11.9 6.9L6.8 14.4H2.2L9.6 3.4L11.6 7.1L16.6 0L20.8 1.6Z"/>
            </svg>
            Continue with Yahoo
          </button>
        </div>

        <div className="mt-12 flex items-center justify-center gap-2 text-xs text-carbon/40">
          <Mail className="h-3 w-3" />
          support@xyphx.com
        </div>
      </motion.div>
    </div>
    </>
  );
};

export default Login;
