'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { UserRole } from '@/types';
import {
  Car,
  ShieldCheck,
  Building2,
  User,
  Phone,
  Lock,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Eye,
  EyeOff,
  BellRing,
  Radio,
  FileCheck2
} from 'lucide-react';
import { TELEGRAM_USERNAME, TELEGRAM_PROFILE_URL } from '@/lib/telegram';

export const AuthGateway = () => {
  const { registerUser, loginUser, loginWithGoogle } = useApp();

  const [authMode, setAuthMode] = useState<'register' | 'login'>('register');
  const [role, setRole] = useState<UserRole>('owner');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+998 90 ');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    registerUser({
      name,
      phone,
      password: password || undefined,
      role,
    });
    setIsLoading(false);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    loginUser(phone, password, role);
    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    await loginWithGoogle(role);
    setIsGoogleLoading(false);
  };

  const handleQuickDemo = (demoPhone: string, demoRole: UserRole) => {
    loginUser(demoPhone, undefined, demoRole);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2.5rem 1rem',
        background: 'radial-gradient(ellipse at 50% 20%, rgba(196, 89, 43, 0.08) 0%, var(--bg-app) 75%)',
      }}
    >
      <div style={{ width: '100%', maxWidth: '620px', margin: '0 auto' }}>
        {/* BRAND LOGO HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '58px',
              height: '58px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, var(--accent-primary) 0%, #8C3E1B 100%)',
              color: '#ffffff',
              boxShadow: '0 8px 24px rgba(196, 89, 43, 0.35)',
              marginBottom: '1rem',
            }}
          >
            <Car size={32} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <h1
              style={{
                fontSize: '2.1rem',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                color: 'var(--text-primary)',
              }}
            >
              Rent<span style={{ color: 'var(--accent-primary)' }}>Avto</span>Control
            </h1>
            <span
              style={{
                padding: '0.2rem 0.55rem',
                borderRadius: '6px',
                background: 'rgba(196, 89, 43, 0.12)',
                color: 'var(--accent-primary)',
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '0.05em',
              }}
            >
              TIZIMI
            </span>
          </div>

          <p
            style={{
              fontSize: '0.98rem',
              color: 'var(--text-secondary)',
              maxWidth: '460px',
              margin: '0 auto',
              lineHeight: 1.5,
            }}
          >
            O&apos;zbekistonda Arendatorlar va Haydovchilar uchun yagona avto-ijara va to&apos;lov nazorati tizimi
          </p>
        </div>

        {/* MAIN AUTH CARD */}
        <div
          className="glass-panel"
          style={{
            padding: '2rem',
            borderRadius: 'var(--radius-xl)',
            boxShadow: '0 20px 50px -10px rgba(0,0,0,0.12)',
            border: '1px solid var(--border-medium)',
            background: 'var(--bg-surface)',
          }}
        >
          {/* STEP 1: CHOOSE ROLE (Haydovchi yoki Arendator) */}
          <div style={{ marginBottom: '1.75rem' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.88rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                marginBottom: '0.75rem',
              }}
            >
              1. Tizimdagi Rolingizni Belgilang:
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              {/* ARENDATOR CARD */}
              <div
                onClick={() => setRole('owner')}
                style={{
                  border: role === 'owner' ? '2.5px solid var(--accent-primary)' : '1px solid var(--border-medium)',
                  background: role === 'owner' ? 'rgba(196, 89, 43, 0.08)' : 'var(--bg-input)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: role === 'owner' ? '0 4px 16px rgba(196, 89, 43, 0.15)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: role === 'owner' ? 'var(--accent-primary)' : 'rgba(120, 95, 75, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: role === 'owner' ? '#ffffff' : 'var(--text-secondary)',
                      }}
                    >
                      <Building2 size={18} />
                    </div>
                    <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>
                      Arendator
                    </span>
                  </div>
                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      border: role === 'owner' ? '5px solid var(--accent-primary)' : '2px solid var(--border-medium)',
                      background: '#ffffff',
                    }}
                  />
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  Mashinasini arendaga beruvchi. <strong>Katalogga mashina qo&apos;sha oladi</strong> va to&apos;lovlarni nazorat qiladi.
                </div>
              </div>

              {/* HAYDOVCHI CARD */}
              <div
                onClick={() => setRole('driver')}
                style={{
                  border: role === 'driver' ? '2.5px solid var(--accent-sage)' : '1px solid var(--border-medium)',
                  background: role === 'driver' ? 'rgba(42, 105, 77, 0.08)' : 'var(--bg-input)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: role === 'driver' ? '0 4px 16px rgba(42, 105, 77, 0.15)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: role === 'driver' ? 'var(--accent-sage)' : 'rgba(120, 95, 75, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: role === 'driver' ? '#ffffff' : 'var(--text-secondary)',
                      }}
                    >
                      <Car size={18} />
                    </div>
                    <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>
                      Haydovchi
                    </span>
                  </div>
                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      border: role === 'driver' ? '5px solid var(--accent-sage)' : '2px solid var(--border-medium)',
                      background: '#ffffff',
                    }}
                  />
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  Arendaga mashina oluvchi. Mashina tanlaydi, <strong>ijara shartnomasi</strong> va to&apos;lov grafigini kuzatadi.
                </div>
              </div>
            </div>
          </div>

          {/* AUTH TABS: REGISTER VS LOGIN */}
          <div
            style={{
              display: 'flex',
              background: 'var(--bg-input)',
              padding: '0.3rem',
              borderRadius: 'var(--radius-pill)',
              marginBottom: '1.5rem',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <button
              type="button"
              onClick={() => setAuthMode('register')}
              style={{
                flex: 1,
                padding: '0.65rem',
                borderRadius: 'var(--radius-pill)',
                fontWeight: 800,
                fontSize: '0.92rem',
                border: 'none',
                background: authMode === 'register' ? 'var(--bg-surface)' : 'transparent',
                color: authMode === 'register' ? 'var(--text-primary)' : 'var(--text-secondary)',
                boxShadow: authMode === 'register' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              ✨ Akkaunt Yaratish (Ro&apos;yxatdan O&apos;tish)
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              style={{
                flex: 1,
                padding: '0.65rem',
                borderRadius: 'var(--radius-pill)',
                fontWeight: 800,
                fontSize: '0.92rem',
                border: 'none',
                background: authMode === 'login' ? 'var(--bg-surface)' : 'transparent',
                color: authMode === 'login' ? 'var(--text-primary)' : 'var(--text-secondary)',
                boxShadow: authMode === 'login' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              🔑 Tizimga Kirish
            </button>
          </div>

          {/* GOOGLE FIREBASE SIGN-IN BUTTON */}
          <div style={{ marginBottom: '1.25rem' }}>
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
                fontSize: '0.96rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                padding: '0.85rem 1.25rem',
                boxShadow: 'var(--shadow-card)',
                cursor: isGoogleLoading ? 'wait' : 'pointer',
              }}
            >
              <GoogleIcon />
              <span>
                {isGoogleLoading
                  ? "Google bilan ulanmoqda..."
                  : `Google orqali ${role === 'owner' ? 'Arendator' : 'Haydovchi'} sifatida kirish`}
              </span>
            </button>
          </div>

          {/* OR DIVIDER */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1rem 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 800, letterSpacing: '0.05em' }}>
              YOKI TELEFON RAQAM ORQALI
            </span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
          </div>

          {/* REGISTRATION FORM */}
          {authMode === 'register' ? (
            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="input-group">
                <label className="input-label">Ism va Familiyangiz</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    required
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
                <label className="input-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Parol (ixtiyoriy)</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-sage)', fontWeight: 600 }}>
                    Kiritilmasa, avtomatik saqlanadi
                  </span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Parolingizni kiriting"
                    className="input-box"
                    style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                  />
                  <Lock
                    size={16}
                    color="var(--text-muted)"
                    style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Automatic save guarantee badge */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(42, 105, 77, 0.08)',
                  border: '1px solid rgba(42, 105, 77, 0.2)',
                  fontSize: '0.78rem',
                  color: 'var(--accent-sage)',
                  fontWeight: 600,
                }}
              >
                <Sparkles size={16} style={{ flexShrink: 0 }} />
                <span>
                  <strong>Avtomatik Parol Saqlash:</strong> Tizim hisobingizni eslab qoladi, har safar qayta terish shart bo&apos;lmaydi.
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary btn-lg"
                style={{
                  width: '100%',
                  fontWeight: 800,
                  fontSize: '1rem',
                  padding: '0.85rem',
                  boxShadow: '0 6px 20px rgba(196, 89, 43, 0.3)',
                }}
              >
                <span>Akkaunt Yaratish va Kirish ({role === 'owner' ? 'Arendator' : 'Haydovchi'})</span>
                <ArrowRight size={18} />
              </button>
            </form>
          ) : (
            /* LOGIN FORM */
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                <label className="input-label">Parol</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Parolingizni kiriting"
                    className="input-box"
                    style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                  />
                  <Lock
                    size={16}
                    color="var(--text-muted)"
                    style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary btn-lg"
                style={{
                  width: '100%',
                  fontWeight: 800,
                  fontSize: '1rem',
                  padding: '0.85rem',
                  boxShadow: '0 6px 20px rgba(196, 89, 43, 0.3)',
                }}
              >
                <span>Tizimga Kirish ({role === 'owner' ? 'Arendator' : 'Haydovchi'})</span>
                <ArrowRight size={18} />
              </button>
            </form>
          )}

          {/* QUICK DEMO ACCOUNTS (NO AZIZ!) */}
          <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '0.65rem' }}>
              Tezkor sinov uchun namunaviy akkauntlar (bir tegishda):
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
              <button
                type="button"
                onClick={() => handleQuickDemo('+998 90 123 45 67', 'owner')}
                className="btn btn-secondary btn-sm"
                style={{ justifyContent: 'space-between', padding: '0.55rem 0.75rem', fontSize: '0.78rem' }}
              >
                <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                  <div style={{ fontWeight: 800 }}>Shavkat E.</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--accent-primary)' }}>🏢 Arendator</div>
                </div>
                <span className="badge badge-terracotta">Kirish</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('+998 94 620 33 44', 'driver')}
                className="btn btn-secondary btn-sm"
                style={{ justifyContent: 'space-between', padding: '0.55rem 0.75rem', fontSize: '0.78rem' }}
              >
                <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                  <div style={{ fontWeight: 800 }}>Sardor Y.</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--accent-sage)' }}>🚗 Haydovchi</div>
                </div>
                <span className="badge badge-sage">Kirish</span>
              </button>
            </div>
          </div>
        </div>

        {/* TRUST BADGES AT BOTTOM */}
        <div
          style={{
            marginTop: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.5rem',
            flexWrap: 'wrap',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ShieldCheck size={16} color="var(--accent-sage)" />
            <span>Xavfsiz Ijara Tizimi</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <BellRing size={16} color="var(--accent-primary)" />
            <span>Avtomatik To&apos;lov Eslatmalari</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <FileCheck2 size={16} color="var(--accent-amber)" />
            <span>Ikki Tomonlama Shartnomalar</span>
          </div>
        </div>
      </div>
    </div>
  );
};

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
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
