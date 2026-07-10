import React, { useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Background from "@/components/landing/Background";
import Footer from "@/components/landing/Footer";
import Reveal from "@/components/motion/Reveal";
import { AnimatePresence, motion } from "framer-motion";
import { Key, Copy, Check, Trash2, Shield, Eye, EyeOff, Lock, AlertCircle, X, ChevronDown, User, Activity, Mail, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  product: string;
  password: string;
  created: string;
  visible: boolean;
}

export default function ApiPage() {
  const { logout } = useAuth();
  const [keys, setKeys] = useState<ApiKey[]>([]);

  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyProduct, setNewKeyProduct] = useState("DotX");
  const [newKeyPassword, setNewKeyPassword] = useState("");
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const [error, setError] = useState("");

  const [actionModal, setActionModal] = useState<{
    isOpen: boolean;
    actionType: 'view' | 'copy' | 'delete' | null;
    keyId: string | null;
  }>({ isOpen: false, actionType: null, keyId: null });
  const [passwordInput, setPasswordInput] = useState("");
  const [modalError, setModalError] = useState("");

  const products = ["DotX", "EnterpriseX", "ShowMySkills"];

  const generateKey = () => {
    setError("");
    if (!newKeyName.trim()) {
      setError("Key label is required.");
      return;
    }
    if (!newKeyPassword || newKeyPassword.length !== 6 || !/^\d+$/.test(newKeyPassword)) {
      setError("A 6-digit numeric password is required.");
      return;
    }

    if (keys.some(k => k.product === newKeyProduct)) {
      setError(`You already have an API key for ${newKeyProduct}. Only 1 key per product is allowed.`);
      return;
    }

    const randomHex = Array.from({ length: 26 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");

    const generated = `xyphx_${newKeyProduct.toLowerCase()}_${randomHex}`;

    const newKeyItem: ApiKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: generated,
      product: newKeyProduct,
      password: newKeyPassword,
      created: new Date().toISOString().split("T")[0],
      visible: false
    };

    setKeys([newKeyItem, ...keys]);
    setNewKeyName("");
    setNewKeyPassword("");
    setNewKeyProduct("DotX");
    setIsCreateModalOpen(false);
  };

  const handleActionClick = (id: string, actionType: 'view' | 'copy' | 'delete') => {
    setActionModal({ isOpen: true, actionType, keyId: id });
    setPasswordInput("");
    setModalError("");
  };

  const confirmAction = () => {
    const keyItem = keys.find(k => k.id === actionModal.keyId);
    if (!keyItem) return;

    if (keyItem.password !== passwordInput) {
      setModalError("Incorrect password.");
      return;
    }

    // Process action
    if (actionModal.actionType === 'delete') {
      setKeys(keys.filter((k) => k.id !== actionModal.keyId));
    } else if (actionModal.actionType === 'view') {
      setKeys(
        keys.map((k) => (k.id === actionModal.keyId ? { ...k, visible: !k.visible } : k))
      );
    } else if (actionModal.actionType === 'copy') {
      navigator.clipboard.writeText(keyItem.key);
      setCopiedKeyId(keyItem.id);
      setTimeout(() => setCopiedKeyId(null), 2000);
    }

    closeModal();
  };

  const closeModal = () => {
    setActionModal({ isOpen: false, actionType: null, keyId: null });
    setPasswordInput("");
    setModalError("");
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-clip font-sans">
      <Background />
      <Navbar />

      {/* Action Modal for Password Verification */}
      <AnimatePresence>
        {actionModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={closeModal}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
              className="bg-paper border border-line-soft rounded-2xl p-6 max-w-sm w-full shadow-2xl relative z-10"
            >
              <button onClick={closeModal} className="absolute top-4 right-4 text-carbon/40 hover:text-carbon transition-colors">
              <X className="w-5 h-5" />
            </button>
            <div className="mb-6 text-center mt-2">
              <div className="mx-auto w-12 h-12 bg-ink/10 rounded-full flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-ink" />
              </div>
              <h3 className="text-xl font-display font-bold text-carbon mb-2 capitalize">
                Authenticate to {actionModal.actionType}
              </h3>
              <p className="text-sm text-carbon/60">
                Please enter your 6-digit password to authorize this action.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <input
                  type="password"
                  maxLength={6}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••••"
                  className="w-full bg-background border border-line-soft text-carbon text-center tracking-[0.5em] text-lg px-4 py-3 rounded-xl focus:outline-none focus:border-ink transition-colors"
                />
              </div>
              {modalError && (
                <div className="flex items-center gap-2 text-red-500 text-sm justify-center">
                  <AlertCircle className="w-4 h-4" />
                  <span>{modalError}</span>
                </div>
              )}
              <button
                onClick={confirmAction}
                disabled={passwordInput.length !== 6}
                className="w-full bg-ink text-white py-3 rounded-xl font-semibold transition-all hover:bg-ink-dark disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm
              </button>
            </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create Key Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => {
                setIsCreateModalOpen(false);
                setError("");
                setNewKeyName("");
                setNewKeyPassword("");
              }}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
              className="bg-paper border border-line-soft rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative z-10"
            >
              <button 
                onClick={() => {
                setIsCreateModalOpen(false);
                setError("");
                setNewKeyName("");
                setNewKeyPassword("");
              }} 
              className="absolute top-6 right-6 text-carbon/40 hover:text-carbon transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="mb-8">
              <h3 className="text-xl font-display font-bold text-carbon">Create New API Key</h3>
              <p className="text-sm text-carbon/60 mt-1">Configure your access token for the XyphX ecosystem.</p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 items-start">
              <div className="space-y-2">
                <label htmlFor="key-name" className="text-[11px] font-semibold text-carbon/50 uppercase tracking-widest block">Key Label</label>
                <input
                  id="key-name"
                  type="text"
                  placeholder="e.g. Production Backend"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="w-full bg-background border border-line-soft text-carbon text-sm px-4 py-3.5 rounded-xl focus:outline-none focus:border-ink transition-colors"
                />
              </div>
              
              <div className="space-y-2 relative z-20">
                <label className="text-[11px] font-semibold text-carbon/50 uppercase tracking-widest block">Product</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`w-full text-left bg-background border text-carbon text-sm px-4 py-3.5 rounded-xl focus:outline-none transition-all flex items-center justify-between ${
                      isDropdownOpen ? 'border-ink shadow-[0_0_0_4px_rgba(95,0,183,0.1)]' : 'border-line-soft hover:border-carbon/30'
                    }`}
                  >
                    <span className="font-medium">{newKeyProduct}</span>
                    <ChevronDown className={`w-4 h-4 text-carbon/40 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-ink' : ''}`} />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute z-30 top-full mt-2 w-full bg-paper border border-line-soft rounded-xl shadow-xl overflow-hidden py-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                      {products.map(p => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => {
                            setNewKeyProduct(p);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center justify-between ${
                            newKeyProduct === p 
                              ? 'bg-ink/5 text-ink font-semibold' 
                              : 'text-carbon/80 hover:bg-background hover:text-carbon'
                          }`}
                        >
                          <span>{p}</span>
                          {newKeyProduct === p && <Check className="w-4 h-4 text-ink" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                {isDropdownOpen && (
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsDropdownOpen(false)}
                  />
                )}
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label htmlFor="key-password" className="text-[11px] font-semibold text-carbon/50 uppercase tracking-widest block">6-Digit Security Password</label>
                <input
                  id="key-password"
                  type="password"
                  maxLength={6}
                  placeholder="Create a 6-digit pin (e.g. 123456)"
                  value={newKeyPassword}
                  onChange={(e) => setNewKeyPassword(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-background border border-line-soft text-carbon text-sm px-4 py-3.5 rounded-xl focus:outline-none focus:border-ink transition-colors"
                />
                <p className="text-xs text-carbon/40 mt-1.5">This password is required for viewing, copying, or deleting this key later.</p>
              </div>

              {error && (
                <div className="sm:col-span-2 flex items-center gap-2 text-red-500 bg-red-500/10 p-4 rounded-xl text-sm border border-red-500/20">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="sm:col-span-2 mt-4">
                <button
                  onClick={generateKey}
                  className="w-full bg-ink text-white py-3.5 rounded-xl font-display font-semibold transition-all duration-300 hover:bg-ink-dark shadow-md shadow-ink/20 hover:shadow-lg hover:shadow-ink/30"
                >
                  Create API Key
                </button>
              </div>
            </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main className="relative z-10 pt-32 pb-24 px-6 md:px-10">
        <div className="mx-auto max-w-[96rem]">

          <div className="grid gap-8 lg:grid-cols-5 items-start max-w-7xl mx-auto">
            {/* API Key Manager (Columns 3) */}
            <div className="lg:col-span-3 space-y-8">
              <Reveal blur={false} delay={0.1}>
                <div className="bg-paper/40 backdrop-blur-md border border-line-soft rounded-3xl p-6 sm:p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-8 pb-8 border-b border-line-soft">
                    <div className="flex items-center gap-3">
                      <Key className="h-6 w-6 text-ink" />
                      <h2 className="font-display text-2xl font-bold text-carbon">API Keys</h2>
                    </div>
                    <button
                      onClick={() => setIsCreateModalOpen(true)}
                      className="bg-ink text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:bg-ink-dark shadow-md shadow-ink/20"
                    >
                      Create API Key
                    </button>
                  </div>

                  {/* List of active keys */}
                  <div className="space-y-4">
                    <h3 className="text-[11px] font-semibold text-carbon/50 uppercase tracking-widest mb-4">Active API Keys</h3>

                    {keys.length === 0 ? (
                      <div className="border border-dashed border-line-soft rounded-2xl p-10 text-center bg-background/50">
                        <p className="text-sm text-carbon/40">No API keys generated yet.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {keys.map((k) => (
                          <div
                            key={k.id}
                            className="group flex flex-col sm:flex-row sm:items-center justify-between gap-5 bg-background border border-line-soft p-5 rounded-2xl hover:border-ink/40 hover:shadow-sm transition-all duration-300"
                          >
                            <div className="space-y-2.5 flex-grow max-w-full overflow-hidden">
                              <div className="flex items-center gap-3">
                                <span className="font-semibold text-[15px] text-carbon">{k.name}</span>
                                <span className="text-[10px] uppercase font-bold tracking-wider bg-ink/10 text-ink px-2.5 py-1 rounded-full">
                                  {k.product}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 bg-paper border border-line-soft px-3.5 py-2.5 rounded-xl font-mono text-xs text-carbon/80 overflow-x-auto shadow-inner">
                                <span className="tracking-widest">{k.visible ? k.key : "••••••••••••••••••••••••••••••••"}</span>
                              </div>
                              <div className="text-[11px] text-carbon/40 font-medium">Created: {k.created}</div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                              <button
                                onClick={() => handleActionClick(k.id, 'view')}
                                title="Toggle Visibility"
                                className="flex items-center justify-center w-11 h-11 border border-line-soft text-carbon/60 hover:text-carbon hover:bg-paper rounded-xl transition-all shadow-sm"
                              >
                                {!k.visible ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                              </button>
                              <button
                                onClick={() => handleActionClick(k.id, 'copy')}
                                title="Copy API Key"
                                className="flex items-center justify-center w-11 h-11 border border-line-soft text-carbon/60 hover:text-ink hover:bg-paper rounded-xl transition-all shadow-sm"
                              >
                                {copiedKeyId === k.id ? <Check className="h-[18px] w-[18px] text-ink" /> : <Copy className="h-[18px] w-[18px]" />}
                              </button>
                              <button
                                onClick={() => handleActionClick(k.id, 'delete')}
                                title="Revoke Token"
                                className="flex items-center justify-center w-11 h-11 border border-line-soft text-carbon/40 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all shadow-sm"
                              >
                                <Trash2 className="h-[18px] w-[18px]" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Profile & Usage (Columns 2) */}
            <div className="lg:col-span-2 space-y-6">
              <Reveal blur={false} delay={0.2}>
                <div className="bg-paper/40 backdrop-blur-md border border-line-soft rounded-3xl p-6 sm:p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <User className="h-6 w-6 text-ink" />
                    <h2 className="font-display text-xl font-bold text-carbon">Profile Info</h2>
                  </div>

                  {/* Profile Header */}
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-8 pb-8 border-b border-line-soft text-center sm:text-left">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-background border border-line-soft shrink-0 shadow-inner">
                      <img src="https://ui-avatars.com/api/?name=Alex+Carter&background=5F00B7&color=fff&size=150" alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display text-xl font-bold text-carbon mb-1">Alex Carter</h3>
                      <div className="flex items-center justify-center sm:justify-start gap-2 text-carbon/60 text-sm mb-3">
                        <Mail className="w-3.5 h-3.5" />
                        <span>alex.carter@example.com</span>
                      </div>
                      <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ink/5 border border-ink/10 text-ink text-[10px] font-bold tracking-widest uppercase shadow-sm">
                          Google Authenticated
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Usage Stats */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Activity className="h-4 w-4 text-carbon/50" />
                      <h4 className="text-[11px] font-semibold text-carbon/50 uppercase tracking-widest">API Usage Metrics</h4>
                    </div>
                    
                    {/* Daily Usage */}
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-end">
                        <span className="text-sm font-medium text-carbon">Daily Requests</span>
                        <span className="text-[11px] font-mono text-carbon/60">1,245 <span className="text-carbon/30">/ 5,000</span></span>
                      </div>
                      <div className="h-2 w-full bg-background border border-line-soft rounded-full overflow-hidden">
                        <div className="h-full bg-ink rounded-full relative overflow-hidden transition-all duration-1000 ease-out" style={{ width: '25%' }}>
                           <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]"></div>
                        </div>
                      </div>
                    </div>

                    {/* Weekly Usage */}
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-end">
                        <span className="text-sm font-medium text-carbon">Weekly Requests</span>
                        <span className="text-[11px] font-mono text-carbon/60">8,432 <span className="text-carbon/30">/ 35,000</span></span>
                      </div>
                      <div className="h-2 w-full bg-background border border-line-soft rounded-full overflow-hidden">
                        <div className="h-full bg-ink/70 rounded-full transition-all duration-1000 ease-out delay-300" style={{ width: '24%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </main>

      <Footer showContact={false} />
    </div>
  );
}
