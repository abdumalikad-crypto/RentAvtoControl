'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  X,
  Phone,
  ShieldCheck,
  User,
  KeyRound,
  Check,
  Copy,
  Building2,
  CarFront,
  Sparkles
} from 'lucide-react';
import { UserRole } from '@/types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const { loginWithPhone, loginWithSavedPassword, loginWithGoogle, users } = useApp();

  const [phone, setPhone] = useState('+998 90 777 00 11');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('owner');
  const [autoSavedPass, setAutoSavedPass] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    const result = await loginWithGoogle(role);
    setIsGoogleLoading(false);
    if (result.success) {
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;

    const result = loginWithPhone(phone, name, role);
    setAutoSavedPass(result.autoPassword);
  };

  const handleCopy = () => {
    if (autoSavedPass) {
      navigator.clipboard.writeText(autoSavedPass);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleQuickLoginAs = (userPhone: string) => {
    loginWithSavedPassword(userPhone);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '520px' }}
      >
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(196, 89, 43, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-primary)',
              }}
            >
              <Phone size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                Telefon Orqali Registratsiya
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Parol avtomatik generatsiya qilinadi va xavfsiz saqlanadi
              </p>
            </div>
          </div>

          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '1.5rem' }}>
          {autoSavedPass ? (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  margin: '0 auto 1rem',
                  borderRadius: '50%',
                  background: 'rgba(42, 105, 77, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-sage)',
                }}
              >
                <ShieldCheck size={36} />
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                Hisobingiz Muvaffaqiyatli Ochildi!
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                Telefon raqamingiz uchun xavfsiz parol avtomatik tarzda tizimda saqlandi. Keyingi safar qayta parol kiritishingiz shart emas.
              </p>

              <div
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <KeyRound size={18} color="var(--accent-amber)" />
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1.05rem', color: 'var(--accent-primary)' }}>
                    {autoSavedPass}
                  </span>
                </div>
                <button
                  onClick={handleCopy}
                  className="btn btn-secondary btn-sm"
                  style={{ gap: '0.35rem' }}
                >
                  {copied ? <Check size={14} color="var(--accent-sage)" /> : <Copy size={14} />}
                  {copied ? 'Nusxalandi' : 'Nusxalash'}
                </button>
              </div>

              <button
                onClick={onClose}
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
              >
                Platformaga O&apos;tish
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Step 1: Select Role */}
              <div className="input-group">
                <label className="input-label" style={{ fontWeight: 800 }}>
                  1. Sizning Rolingizni Tanlang:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div
                    onClick={() => setRole('owner')}
                    style={{
                      border: role === 'owner' ? '2px solid var(--accent-primary)' : '1px solid var(--border-medium)',
                      background: role === 'owner' ? 'rgba(196, 89, 43, 0.1)' : 'var(--bg-input)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.85rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <Building2 size={18} color="var(--accent-primary)" />
                      <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Arendator</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      Mashinasini arendaga beradigan egalar (mashina qo&apos;sha oladi)
                    </div>
                  </div>

                  <div
                    onClick={() => setRole('driver')}
                    style={{
                      border: role === 'driver' ? '2px solid var(--accent-sage)' : '1px solid var(--border-medium)',
                      background: role === 'driver' ? 'rgba(42, 105, 77, 0.1)' : 'var(--bg-input)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.85rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <CarFront size={18} color="var(--accent-sage)" />
                      <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Haydovchi</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      Arendaga mashina olib minadigan haydovchi / mijoz
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: PRIMARY GOOGLE FIREBASE SIGN-IN BUTTON */}
              <div>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleLoading}
                  className="btn btn-secondary btn-lg"
                  style={{
                    width: '100%',
                    background: 'var(--bg-surface-elevated)',
                    border: '1.5px solid var(--border-medium)',
                    color: 'var(--text-primary)',
                    fontWeight: 800,
                    fontSize: '0.98rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    boxShadow: 'var(--shadow-soft)',
                    padding: '0.85rem 1.25rem',
                    cursor: isGoogleLoading ? 'wait' : 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <GoogleIcon />
                  <span>
                    {isGoogleLoading
                      ? "Google bilan ulanmoqda..."
                      : `Google orqali kirish (Firebase)`}
                  </span>
                </button>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.35rem' }}>
                  Firebase Auth orqali bir tegishda xavfsiz Google hisobingiz bilan kiring
                </div>
              </div>

              {/* OR Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '0.2rem 0' }}>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 800, letterSpacing: '0.04em' }}>
                  YOKI TELEFON RAQAM ORQALI
                </span>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
              </div>

              {/* Phone form */}
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="input-group">
                  <label className="input-label">Telefon Raqamingiz</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+998 90 123 45 67"
                      className="input-box"
                      style={{ paddingLeft: '2.5rem' }}
                    />
                    <Phone
                      size={16}
                      color="var(--text-muted)"
                      style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Ism va Familiyangiz (ixtiyoriy)</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Masalan: Jasur Alimov"
                      className="input-box"
                      style={{ paddingLeft: '2.5rem' }}
                    />
                    <User
                      size={16}
                      color="var(--text-muted)"
                      style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
                    />
                  </div>
                </div>

              {/* Auto password badge guarantee */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.75rem 0.95rem',
                  background: 'rgba(42, 105, 77, 0.1)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(42, 105, 77, 0.25)',
                }}
              >
                <Sparkles size={18} color="var(--accent-sage)" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '0.8rem', color: 'var(--accent-sage)', fontWeight: 600 }}>
                  <strong>Avtomatik Parol Saqlash Faol:</strong> Tizim parolni o&apos;zi yaratib eslab qoladi.
                </span>
              </div>

              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                Telefon Raqam Bilan Kirish
              </button>

              {/* Quick Demo Switcher */}
              <div style={{ marginTop: '0.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textAlign: 'center' }}>
                  Yoki tayyor akkauntlar bilan bir tegishda kiring:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  <button
                    type="button"
                    onClick={() => handleQuickLoginAs('+998 90 123 45 67')}
                    className="btn btn-secondary btn-sm"
                    style={{ justifyContent: 'space-between', width: '100%' }}
                  >
                    <span>🏢 Shavkat Ergashev (Arendator egasi)</span>
                    <span className="badge badge-terracotta">Kirish</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLoginAs('+998 94 620 33 44')}
                    className="btn btn-secondary btn-sm"
                    style={{ justifyContent: 'space-between', width: '100%' }}
                  >
                    <span>🚗 Sardor Yo&apos;ldoshev (Haydovchi)</span>
                    <span className="badge badge-sage">Kirish</span>
                  </button>
                </div>
              </div>
            </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
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
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}
