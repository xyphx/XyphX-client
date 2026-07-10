import React from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, Mail } from "lucide-react";

const Login: React.FC = () => {
  const { login, user, isAdmin, loading } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/admin";

  // If already logged in as admin, redirect
  if (user && isAdmin) {
    return <Navigate to={from} replace />;
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white p-4 font-sans">
      <div className="absolute inset-0 bg-dot-grid" aria-hidden />
      <div className="absolute -top-40 left-1/4 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(95,0,183,0.14),transparent_70%)] blur-3xl animate-blob" aria-hidden />
      <div className="absolute -bottom-40 right-1/4 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(199,125,255,0.16),transparent_70%)] blur-3xl animate-blob animation-delay-2000" aria-hidden />

      <motion.div
        initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.8, ease: [0.21, 0.6, 0.35, 1] }}
        className="relative z-10 w-full max-w-md overflow-hidden rounded-[2rem] glass-strong p-8 shadow-depth"
      >
        <div className="mb-8 text-center">
          <motion.div
            initial={{ scale: 0.7, rotate: -8 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 160, damping: 14, delay: 0.15 }}
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#5F00B7,#9B30FF)] shadow-glow"
          >
            <ShieldCheck className="h-8 w-8 text-white" />
          </motion.div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-black">Admin Access</h1>
          <p className="mt-2 text-black/55">Authorized personnel only</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => login()}
            disabled={loading}
            className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl border border-primary/15 bg-white px-6 py-3.5 font-semibold text-black shadow-sm transition-all duration-300 hover:border-primary/35 hover:shadow-glow active:scale-[0.98] disabled:opacity-50"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </button>

          <div className="flex items-center gap-4 py-2">
            <div className="h-px flex-1 bg-primary/10" />
            <span className="text-xs uppercase tracking-widest text-black/40">Security Note</span>
            <div className="h-px flex-1 bg-primary/10" />
          </div>

          <p className="text-center text-sm text-black/50">
            Access is restricted to emails registered in the{" "}
            <code className="rounded bg-purple-50 px-1.5 py-0.5 text-primary">admins</code> collection.
          </p>
        </div>

        {/* Footer info */}
        <div className="mt-12 flex items-center justify-center gap-2 text-xs text-black/40">
          <Mail className="h-3 w-3" />
          support@xyphx.com
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
