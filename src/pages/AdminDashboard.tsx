import React from "react";
import { useAuth } from "../hooks/useAuth";
import { motion } from "framer-motion";
import {
  LogOut,
  LayoutDashboard,
  Users,
  Settings,
  Shield,
  Bell,
  Search,
  ExternalLink,
} from "lucide-react";

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();

  const mockStats = [
    { label: "Active Sessions", value: "1,284", icon: Users, color: "text-primary" },
    { label: "System Security", value: "99.9%", icon: Shield, color: "text-emerald-600" },
    { label: "Alerts", value: "0", icon: Bell, color: "text-[#9B30FF]" },
  ];

  return (
    <div className="min-h-screen bg-white text-foreground font-sans selection:bg-primary/20">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-full w-64 border-r border-primary/10 bg-white/80 backdrop-blur-xl lg:block">
        <div className="flex h-full flex-col p-6">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#5F00B7,#9B30FF)] shadow-glow">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-black">XyphX OS</span>
          </div>

          <nav className="flex-1 space-y-1">
            <NavItem icon={LayoutDashboard} label="Dashboard" active />
            <NavItem icon={Users} label="Team" />
            <NavItem icon={Settings} label="System Config" />
          </nav>

          <button
            onClick={logout}
            className="mt-auto flex items-center gap-3 rounded-xl px-4 py-3 text-black/55 transition-colors hover:bg-red-500/10 hover:text-red-500"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout System</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="p-4 lg:ml-64 lg:p-8">
        {/* Header */}
        <header className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h1 className="mb-1 font-display text-3xl font-bold tracking-tight text-black">
              Administrative Terminal
            </h1>
            <p className="text-black/55">Welcome back, {user?.displayName || "Admin"}</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="group relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/35 transition-colors group-focus-within:text-primary" />
              <input
                type="text"
                placeholder="Search resources..."
                className="w-64 rounded-xl border border-primary/15 bg-white py-2.5 pl-10 pr-4 font-medium shadow-sm transition-all placeholder:text-black/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <img
              src={user?.photoURL || ""}
              alt="Avatar"
              className="h-10 w-10 rounded-full border border-primary/20"
            />
          </div>
        </header>

        {/* Stats Grid */}
        <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {mockStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group relative rounded-2xl glass p-6 shadow-depth transition-all hover:shadow-glow"
            >
              <div className={`${stat.color} mb-4`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <p className="mb-1 text-sm font-medium uppercase tracking-wider text-black/45">{stat.label}</p>
              <h3 className="font-display text-2xl font-bold text-black">{stat.value}</h3>
            </motion.div>
          ))}
        </div>

        {/* Content Section */}
        <section className="rounded-3xl glass p-8 shadow-depth">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-black">Recent Authorization Requests</h2>
            <button className="flex items-center gap-1 text-sm text-primary transition-colors hover:text-[#9B30FF]">
              View Audit Logs <ExternalLink className="h-3 w-3" />
            </button>
          </div>

          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-xl border border-primary/10 bg-white/60 p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 animate-pulse rounded-full bg-purple-100" />
                  <div>
                    <div className="mb-2 h-4 w-32 animate-pulse rounded bg-purple-100" />
                    <div className="h-3 w-20 animate-pulse rounded bg-purple-50" />
                  </div>
                </div>
                <div className="h-8 w-20 animate-pulse rounded-lg bg-purple-100" />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

const NavItem = ({ icon: Icon, label, active = false }: any) => (
  <a
    href="#"
    className={`flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-all ${
      active ? "bg-primary/10 text-primary" : "text-black/55 hover:bg-purple-50 hover:text-black"
    }`}
  >
    <Icon className="h-5 w-5" />
    <span>{label}</span>
  </a>
);

export default AdminDashboard;
