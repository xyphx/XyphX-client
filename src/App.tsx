import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import Pricing from "./pages/Pricing";
import ApiPage from "./pages/ApiPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastProvider } from "@radix-ui/react-toast";
import SeoHead from "./components/SeoHead";
import { useAuth } from "./hooks/useAuth";
import { Navigate } from "react-router-dom";
import CustomCursor from "@/components/motion/CustomCursor";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const homeSchema = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "XyphX",
    "url": "https://xyphx.com",
    "logo": "https://xyphx.com/logo.png",
    "description": "XyphX is an enterprise technology and AI company building next-generation software, cloud infrastructure, and intelligent digital products.",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "availableLanguage": ["English"]
    },
    "sameAs": [
      "https://github.com/xyphx",
      "https://linkedin.com/company/xyphx",
      "https://careers.xyphx.com"
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "XyphX",
    "url": "https://xyphx.com/",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://xyphx.com/?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "DotX",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "All",
    "url": "https://dotx.xyphx.com/",
    "description": "AI-powered autonomous multi-agent platform for software engineering and enterprise automation."
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "ShowMySkills",
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "All",
    "url": "https://showmyskills.xyphx.com/",
    "description": "Student portfolio, skills, achievements, and career showcase platform."
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "XyphX Careers",
    "url": "https://careers.xyphx.com/",
    "description": "Career opportunities and open positions at XyphX."
  }
];

const HomePage = () => {
  return (
    <>
      <SeoHead
        title="XyphX – Engineering the Future of Tech"
        description="XyphX is an enterprise AI and technology company building next-generation software, cloud infrastructure, and intelligent products like DotX and ShowMySkills."
        keywords="XyphX, AI software engineering, enterprise automation, student portfolio, developer platform, DotX, ShowMySkills, XyphX OS"
        canonicalPath="/"
        schema={homeSchema}
      />
      <Index />
    </>
  );
};

const PricingPage = () => (
  <ProtectedRoute>
    <SeoHead
      title="Pricing Options | XyphX"
      description="Explore flexible monthly and annual subscription options for scaled access to the XyphX developer framework, APIs, and DotX AI agents."
      keywords="XyphX pricing, developer plans, DotX subscription, API costs"
      canonicalPath="/pricing"
    />
    <Pricing />
  </ProtectedRoute>
);

const ApiPageWrapper = () => (
  <ProtectedRoute>
    <SeoHead
      title="Developer API Portal | XyphX"
      description="Generate API Keys and interface your developer workspaces directly with the XyphX AI execution loop and enterprise APIs."
      keywords="XyphX API, developer portal, generate API key, integration token, enterprise AI API"
      canonicalPath="/console"
    />
    <ApiPage />
  </ProtectedRoute>
);

const LoginPage = () => (
  <>
    <SeoHead
      title="Login | XyphX"
      description="Securely sign in to your XyphX account to access enterprise products, AI workspace, and management tools."
      canonicalPath="/login"
      robots="index, follow"
    />
    <Login />
  </>
);

const AdminPage = () => {
  useEffect(() => {
    window.location.replace("https://admin.xyphx.com");
  }, []);
  
  return (
    <SeoHead
      title="Admin Portal | XyphX"
      description="Administration portal for managing XyphX platforms, ecosystem services, and enterprise controls."
      canonicalPath="/admin"
      robots="index, follow"
    />
  );
};

const NotFoundPage = () => (
  <>
    <SeoHead
      title="404 - Page Not Found | XyphX"
      description="The page you requested could not be found on XyphX."
      canonicalPath="/404"
      robots="noindex, nofollow"
    />
    <NotFound />
  </>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ToastProvider>
      <CustomCursor />
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/console" element={<ApiPageWrapper />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
      </ToastProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
