import React, { useState, useEffect } from "react";
import Navbar from "@/components/landing/Navbar";
import Background from "@/components/landing/Background";
import Footer from "@/components/landing/Footer";
import Reveal from "@/components/motion/Reveal";
import { AnimatePresence, motion } from "framer-motion";
import { Key, Copy, Check, Trash2, Shield, Eye, EyeOff, Lock, AlertCircle, X, ChevronDown, User, Activity, Mail, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";

interface ApiKey {
  id: string;
  label: string;
  productName: string;
  keyValueMasked: string;
  keyValueFull?: string;
  createdAt: string;
  visible: boolean;
}

interface ProfileData {
  email: string;
  name: string;
  picture: string;
  connectedProviders: string[];
  metrics: {
    dailyRequests: number;
    dailyLimit: number;
    weeklyRequests: number;
    weeklyLimit: number;
  };
}

export default function ApiPage() {
  const { logout, user } = useAuth();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [profile, setProfile] = useState<ProfileData | null>(null);

  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyPassword, setNewKeyPassword] = useState("");
  const [newKeyProduct, setNewKeyProduct] = useState("");
  const [products, setProducts] = useState<{id: string, name: string}[]>([]);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [sendingEmailKeyId, setSendingEmailKeyId] = useState<string | null>(null);
  const [sentEmailKeyId, setSentEmailKeyId] = useState<string | null>(null);
  
  const [error, setError] = useState("");

  const [actionModal, setActionModal] = useState<{
    isOpen: boolean;
    actionType: 'view' | 'copy' | 'delete' | null;
    keyId: string | null;
  }>({ isOpen: false, actionType: null, keyId: null });
  const [passwordInput, setPasswordInput] = useState("");
  const [modalError, setModalError] = useState("");

  const [emailConfirmModal, setEmailConfirmModal] = useState<{
    isOpen: boolean;
    keyId: string | null;
    keyLabel: string | null;
  }>({ isOpen: false, keyId: null, keyLabel: null });

  useEffect(() => {
    fetchProfile();
    fetchKeys();
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/api/public/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
        if (data.length > 0) {
          setNewKeyProduct(data[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await api.get('/api/users/me');
      if (res.ok) setProfile(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const fetchKeys = async () => {
    try {
      const res = await api.get('/api/apikeys');
      if (res.ok) {
        const data = await res.json();
        setKeys(data.map((k: any) => ({ ...k, visible: false })));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const generateKey = async () => {
    setError("");
    if (!newKeyName.trim()) {
      setError("Key label is required.");
      return;
    }
    if (!newKeyPassword || newKeyPassword.length !== 6 || !/^\d+$/.test(newKeyPassword)) {
      setError("A 6-digit numeric password is required.");
      return;
    }

    try {
      const res = await api.post('/api/apikeys', {
        label: newKeyName,
        productId: newKeyProduct,
        pin: newKeyPassword
      });

      if (res.ok) {
        const newKey = await res.json();
        setKeys([{ ...newKey, visible: false }, ...keys]);
        setNewKeyName("");
        setNewKeyPassword("");
        if (products.length > 0) setNewKeyProduct(products[0].id);
        setIsCreateModalOpen(false);
      } else {
        const data = await res.json();
        setError(data.message || "Failed to create API key");
      }
    } catch (e) {
      setError("An unexpected error occurred.");
    }
  };

  const handleActionClick = async (id: string, actionType: 'view' | 'copy' | 'delete') => {
    const keyItem = keys.find(k => k.id === id);
    if (!keyItem) return;

    if (actionType === 'view' && keyItem.visible) {
      setKeys(keys.map(k => k.id === id ? { ...k, visible: false, keyValueFull: undefined } : k));
      return;
    }

    if (actionType === 'delete') {
      setActionModal({ isOpen: true, actionType, keyId: id });
      setPasswordInput("");
      setModalError("");
      return;
    }

    try {
      const res = await api.get(`/api/apikeys/${id}/view`);
      if (res.ok) {
        const fullKey = await res.text();
        if (actionType === 'view') {
          setKeys(keys.map(k => k.id === id ? { ...k, visible: true, keyValueFull: fullKey } : k));
        } else if (actionType === 'copy') {
          navigator.clipboard.writeText(fullKey);
          setCopiedKeyId(id);
          setTimeout(() => setCopiedKeyId(null), 2000);
        }
      } else {
        const errorText = await res.text();
        alert(`Failed to fetch API key: ${res.status} ${res.statusText}\n${errorText}\n\nIf you see 405 or 400, your backend is still running old code. Please restart your Spring Boot backend!`);
      }
    } catch (e: any) {
      console.error("Failed to fetch full API key", e);
      alert(`Network error: ${e.message}. Backend might be down or restarting.`);
    }
  };

  const openEmailConfirmModal = (keyId: string, keyLabel: string) => {
    setEmailConfirmModal({ isOpen: true, keyId, keyLabel });
  };

  const handleConfirmSendEmail = async () => {
    const { keyId } = emailConfirmModal;
    if (!keyId) return;

    setEmailConfirmModal({ isOpen: false, keyId: null, keyLabel: null });
    setSendingEmailKeyId(keyId);

    try {
      const res = await api.post(`/api/apikeys/${keyId}/send-password`);
      if (res.ok) {
        setSentEmailKeyId(keyId);
        setTimeout(() => setSentEmailKeyId(null), 3000);
      }
    } catch (e) {
      console.error("Failed to send new password email", e);
    } finally {
      setSendingEmailKeyId(null);
    }
  };

  const confirmAction = async () => {
    const { keyId, actionType } = actionModal;
    if (!keyId) return;

    setModalError("");

    try {
      if (actionType === 'delete') {
        const res = await api.delete(`/api/apikeys/${keyId}`, {
          body: JSON.stringify({ pin: passwordInput }),
          headers: { 'Content-Type': 'application/json' }
        });
        if (res.ok) {
          setKeys(keys.filter((k) => k.id !== keyId));
          closeModal();
        } else {
          setModalError("Incorrect password or failed to delete.");
        }
      }
    } catch (e) {
      setModalError("An unexpected error occurred.");
    }
  };

  const closeModal = () => {
    setActionModal({ isOpen: false, actionType: null, keyId: null });
    setPasswordInput("");
    setModalError("");
  };

  const calculatePercentage = (used: number, limit: number) => {
    if (!limit) return 0;
    return Math.min(100, Math.round((used / limit) * 100));
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-clip font-sans">
      <Background />
      <Navbar />

      {/* Custom Confirmation Modal for Sending Password Email */}
      <AnimatePresence>
        {emailConfirmModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 bg-background/80"
              onClick={() => setEmailConfirmModal({ isOpen: false, keyId: null, keyLabel: null })}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="bg-paper border border-line-soft rounded-2xl p-6 max-w-sm w-full shadow-xl relative z-10 will-change-transform"
            >
              <button 
                onClick={() => setEmailConfirmModal({ isOpen: false, keyId: null, keyLabel: null })} 
                className="absolute top-4 right-4 text-carbon/40 hover:text-carbon transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="mb-6 text-center mt-2">
                <div className="mx-auto w-12 h-12 bg-ink/10 rounded-full flex items-center justify-center mb-4 text-ink">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-display font-bold text-carbon mb-2">
                  Send New Password?
                </h3>
                <p className="text-sm text-carbon/60">
                  Are you sure you want to generate a new 6-digit API password and send it to your email?
                </p>
                {emailConfirmModal.keyLabel && (
                  <div className="mt-3 inline-block bg-ink/5 border border-ink/10 text-ink text-xs font-semibold px-3 py-1 rounded-full">
                    Key: {emailConfirmModal.keyLabel}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setEmailConfirmModal({ isOpen: false, keyId: null, keyLabel: null })}
                  className="flex-1 bg-background border border-line-soft text-carbon/80 hover:text-carbon py-3 rounded-xl font-semibold text-sm transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSendEmail}
                  className="flex-1 bg-ink text-white py-3 rounded-xl font-semibold text-sm transition-all hover:bg-ink-dark shadow-md shadow-ink/20"
                >
                  Send Email
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Action Modal for Password Verification */}
      <AnimatePresence>
        {actionModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 bg-background/80"
              onClick={closeModal}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="bg-paper border border-line-soft rounded-2xl p-6 max-w-sm w-full shadow-xl relative z-10 will-change-transform"
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
              transition={{ duration: 0.15 }}
              className="absolute inset-0 bg-background/80"
              onClick={() => {
                setIsCreateModalOpen(false);
                setError("");
                setNewKeyName("");
                setNewKeyPassword("");
              }}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="bg-paper border border-line-soft rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-xl relative z-10 will-change-transform"
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
                    <span className="font-medium">{products.find(p => p.id === newKeyProduct)?.name || 'Select Product'}</span>
                    <ChevronDown className={`w-4 h-4 text-carbon/40 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-ink' : ''}`} />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute z-30 top-full mt-2 w-full bg-paper border border-line-soft rounded-xl shadow-xl overflow-hidden py-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                      {products.map(p => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            setNewKeyProduct(p.id);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center justify-between ${
                            newKeyProduct === p.id 
                              ? 'bg-ink/5 text-ink font-semibold' 
                              : 'text-carbon/80 hover:bg-background hover:text-carbon'
                          }`}
                        >
                          <span>{p.name}</span>
                          {newKeyProduct === p.id && <Check className="w-4 h-4 text-ink" />}
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
            <div className="order-2 lg:order-1 lg:col-span-3 space-y-8">
              <Reveal blur={false} delay={0.1}>
                <div className="bg-paper border border-line-soft rounded-3xl p-6 sm:p-8 shadow-sm">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-8 border-b border-line-soft">
                    <div className="flex items-center gap-3">
                      <Key className="h-6 w-6 text-ink" />
                      <h2 className="font-display text-2xl font-bold text-carbon">API Keys</h2>
                    </div>
                    <button
                      onClick={() => setIsCreateModalOpen(true)}
                      className="bg-ink text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:bg-ink-dark shadow-md shadow-ink/20 shrink-0"
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
                            className="group flex flex-col sm:flex-row sm:items-center justify-between gap-5 bg-background border border-line-soft p-4 sm:p-5 rounded-2xl hover:border-ink/40 hover:shadow-sm transition-all duration-300 min-w-0"
                          >
                            <div className="space-y-2.5 flex-grow min-w-0 max-w-full overflow-hidden">
                              <div className="flex items-center gap-3 flex-wrap">
                                <span className="font-semibold text-[15px] text-carbon">{k.label}</span>
                                <span className="text-[10px] uppercase font-bold tracking-wider bg-ink/10 text-ink px-2.5 py-1 rounded-full">
                                  {k.productName}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 bg-paper border border-line-soft px-3 py-2 rounded-xl font-mono text-xs text-carbon/80 overflow-x-auto shadow-inner max-w-full">
                                <span className="tracking-wider break-all">{k.visible && k.keyValueFull ? k.keyValueFull : k.keyValueMasked}</span>
                              </div>
                              <div className="text-[11px] text-carbon/40 font-medium">Created: {new Date(k.createdAt).toLocaleDateString()}</div>
                            </div>

                            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 self-end sm:self-center">
                              <button
                                onClick={() => handleActionClick(k.id, 'view')}
                                title="Toggle Visibility"
                                className="flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 border border-line-soft text-carbon/60 hover:text-carbon hover:bg-paper rounded-xl transition-all shadow-sm"
                              >
                                {!k.visible ? <EyeOff className="h-[16px] w-[16px] sm:h-[18px] sm:w-[18px]" /> : <Eye className="h-[16px] w-[16px] sm:h-[18px] sm:w-[18px]" />}
                              </button>
                              <button
                                onClick={() => handleActionClick(k.id, 'copy')}
                                title="Copy API Key"
                                className="flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 border border-line-soft text-carbon/60 hover:text-ink hover:bg-paper rounded-xl transition-all shadow-sm"
                              >
                                {copiedKeyId === k.id ? <Check className="h-[16px] w-[16px] sm:h-[18px] sm:w-[18px] text-ink" /> : <Copy className="h-[16px] w-[16px] sm:h-[18px] sm:w-[18px]" />}
                              </button>
                              <button
                                onClick={() => openEmailConfirmModal(k.id, k.label)}
                                disabled={sendingEmailKeyId === k.id}
                                title="Send New Password to Email"
                                className="flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 border border-line-soft text-carbon/60 hover:text-ink hover:bg-paper rounded-xl transition-all shadow-sm disabled:opacity-50"
                              >
                                {sentEmailKeyId === k.id ? (
                                  <Check className="h-[16px] w-[16px] sm:h-[18px] sm:w-[18px] text-green-600" />
                                ) : (
                                  <Mail className="h-[16px] w-[16px] sm:h-[18px] sm:w-[18px]" />
                                )}
                              </button>
                              <button
                                onClick={() => handleActionClick(k.id, 'delete')}
                                title="Revoke Token"
                                className="flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 border border-line-soft text-carbon/40 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all shadow-sm"
                              >
                                <Trash2 className="h-[16px] w-[16px] sm:h-[18px] sm:w-[18px]" />
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
            <div className="order-1 lg:order-2 lg:col-span-2 space-y-6">
              <Reveal blur={false} delay={0.2}>
                <div className="bg-paper border border-line-soft rounded-3xl p-6 sm:p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <User className="h-6 w-6 text-ink" />
                    <h2 className="font-display text-xl font-bold text-carbon">Profile Info</h2>
                  </div>

                  {/* Profile Header */}
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-6 text-center sm:text-left">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-background border border-line-soft shrink-0 shadow-inner">
                      <img src={profile?.picture || user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name || user?.displayName || 'User')}&background=5F00B7&color=fff&size=150`} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-xl font-bold text-carbon mb-1">{profile?.name || user?.displayName || 'User'}</h3>
                      <div className="flex items-center justify-center sm:justify-start gap-2 text-carbon/60 text-sm">
                        <Mail className="w-3.5 h-3.5" />
                        <span className="truncate">{profile?.email || user?.email || 'N/A'}</span>
                      </div>
                      {!profile && (
                        <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ink/5 border border-ink/10 text-ink text-[10px] font-bold tracking-widest uppercase shadow-sm">
                          Authenticated
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Connected Auth Providers (Full X-Axis Width) */}
                  <div className="space-y-3 mb-8 pb-8 border-b border-line-soft w-full">
                    {['Google', 'Microsoft', 'Yahoo'].map(provider => {
                      const isConnected = profile?.connectedProviders?.map(p => p.toLowerCase()).includes(provider.toLowerCase());
                      return (
                        <div key={provider} className="flex items-center justify-between p-3.5 rounded-xl border border-line-soft bg-paper/50 w-full">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-ink animate-pulse' : 'bg-carbon/20'}`}></div>
                            <span className="text-sm font-medium text-carbon">{provider}</span>
                          </div>
                          {isConnected ? (
                            <span className="text-[10px] uppercase font-bold tracking-wider text-ink bg-ink/10 px-2.5 py-1 rounded-md">
                              Connected
                            </span>
                          ) : (
                            <a
                              href={`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/auth/${provider.toLowerCase()}`}
                              className="text-[11px] uppercase font-bold tracking-wider text-carbon/60 hover:text-ink transition-colors px-3 py-1.5 border border-line-soft hover:border-ink/30 rounded-lg hover:bg-ink/5"
                            >
                              Connect
                            </a>
                          )}
                        </div>
                      );
                    })}
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
                        <span className="text-[11px] font-mono text-carbon/60">{profile?.metrics?.dailyRequests.toLocaleString() || 0} <span className="text-carbon/30">/ {profile?.metrics?.dailyLimit.toLocaleString() || 5000}</span></span>
                      </div>
                      <div className="h-2 w-full bg-background border border-line-soft rounded-full overflow-hidden">
                        <div className="h-full bg-ink rounded-full relative overflow-hidden transition-all duration-1000 ease-out" style={{ width: `${calculatePercentage(profile?.metrics?.dailyRequests || 0, profile?.metrics?.dailyLimit || 5000)}%` }}>
                           <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]"></div>
                        </div>
                      </div>
                    </div>

                    {/* Weekly Usage */}
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-end">
                        <span className="text-sm font-medium text-carbon">Weekly Requests</span>
                        <span className="text-[11px] font-mono text-carbon/60">{profile?.metrics?.weeklyRequests.toLocaleString() || 0} <span className="text-carbon/30">/ {profile?.metrics?.weeklyLimit.toLocaleString() || 35000}</span></span>
                      </div>
                      <div className="h-2 w-full bg-background border border-line-soft rounded-full overflow-hidden">
                        <div className="h-full bg-ink/70 rounded-full transition-all duration-1000 ease-out delay-300" style={{ width: `${calculatePercentage(profile?.metrics?.weeklyRequests || 0, profile?.metrics?.weeklyLimit || 35000)}%` }}></div>
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
