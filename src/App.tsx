import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastProvider } from "@radix-ui/react-toast";
import SeoHead from "./components/SeoHead";

const queryClient = new QueryClient();

const homeSchema = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "XyphX",
    "url": "https://xyphx.com",
    "logo": "https://xyphx.com/logo.png",
    "description": "XyphX builds next-gen software, cloud tools, and intelligent digital products for modern enterprises.",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "availableLanguage": ["English"]
    },
    "sameAs": [
      "https://github.com/xyphx",
      "https://linkedin.com/company/xyphx"
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
  }
];

const HomePage = () => (
  <>
    <SeoHead
      title="XyphX – Engineering the Future of Tech"
      description="XyphX is an enterprise technology company building next-gen software, cloud infrastructure, and intelligent AI products. Explore DotX, ShowMySkills, and XyphX OS."
      keywords="XyphX, AI software engineering, enterprise automation, student portfolio, developer platform, DotX, ShowMySkills, XyphX OS"
      canonicalPath="/"
      schema={homeSchema}
    />
    <Index />
  </>
);

const LoginPage = () => (
  <>
    <SeoHead
      title="Login | XyphX"
      description="Securely sign in to your XyphX account to access enterprise products, workspace, and management tools."
      canonicalPath="/login"
      robots="noindex, nofollow"
    />
    <Login />
  </>
);

const AdminPage = () => (
  <>
    <SeoHead
      title="Admin Portal | XyphX"
      description="Public administration portal for managing XyphX platforms and ecosystem services."
      canonicalPath="/admin"
      robots="noindex, nofollow, noarchive"
    />
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  </>
);

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
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
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
