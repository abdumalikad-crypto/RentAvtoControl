'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  Car,
  PlusCircle,
  Shield,
  FileText,
  Bell,
  Sun,
  Moon,
  LogOut,
  Phone,
  CheckCircle,
  Building2,
  User,
  SlidersHorizontal,
  Send
} from 'lucide-react';
import { NotificationModal } from '@/components/NotificationModal';
import { AuthModal } from '@/components/AuthModal';
import { TELEGRAM_USERNAME, TELEGRAM_PROFILE_URL } from '@/lib/telegram';

export const Header = () => {
  const pathname = usePathname();
  const {
    currentUser,
    switchUserRole,
    unreadCount,
    logout,
    theme,
    toggleTheme,
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <>
      <header className="site-header">
        <div className="container nav-container">
          {/* Logo */}
          <Link href="/" className="logo-wrap">
            <div className="logo-badge">
              <Car size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <span style={{ fontSize: '1.3rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                  Ijara<span style={{ color: 'var(--accent-primary)' }}>Avto</span>
                </span>
                <span className="badge badge-terracotta" style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}>
                  PRO
                </span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                Arendatorlar & Haydovchilar Ekotizimi
              </div>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="nav-links">
            <Link
              href="/cars"
              className={`nav-item ${pathname === '/cars' ? 'active' : ''}`}
            >
              <Car size={16} />
              <span>Barcha Mashinalar</span>
            </Link>

            <Link
              href="/add-car"
              className={`nav-item ${pathname === '/add-car' ? 'active' : ''}`}
              style={{
                position: 'relative',
                color: currentUser?.role === 'owner' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              }}
            >
              <PlusCircle size={16} />
              <span>Mashina Qo&apos;shish</span>
              {currentUser?.role !== 'owner' && currentUser?.role !== 'admin' && (
                <span
                  style={{
                    fontSize: '0.65rem',
                    background: 'rgba(196, 71, 56, 0.15)',
                    color: 'var(--accent-rust)',
                    padding: '0.1rem 0.35rem',
                    borderRadius: '4px',
                    marginLeft: '2px',
                    fontWeight: 700,
                  }}
                >
                  Faqat Arendator
                </span>
              )}
            </Link>

            <Link
              href="/contracts"
              className={`nav-item ${pathname === '/contracts' ? 'active' : ''}`}
            >
              <FileText size={16} />
              <span>Shartnomalar & To&apos;lov</span>
            </Link>

            <Link
              href="/admin"
              className={`nav-item ${pathname === '/admin' ? 'active' : ''}`}
            >
              <Shield size={16} />
              <span>Admin Panel</span>
            </Link>
          </nav>

          {/* Right Action Tools: Role Switcher, Bell, Auth */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {/* Quick Role Switcher Pill Bar for Demo testing */}
            <div className="role-bar" title="Rolni darhol o'zgartirib ko'ring">
              <button
                onClick={() => switchUserRole('owner')}
                className={`role-pill ${currentUser?.role === 'owner' ? 'active' : ''}`}
              >
                <Building2 size={13} />
                <span>Arendator</span>
              </button>
              <button
                onClick={() => switchUserRole('driver')}
                className={`role-pill ${currentUser?.role === 'driver' ? 'active' : ''}`}
              >
                <User size={13} />
                <span>Haydovchi</span>
              </button>
            </div>

            {/* Direct Telegram payment contact pill */}
            <a
              href={TELEGRAM_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
              style={{
                borderColor: 'var(--accent-primary)',
                color: 'var(--accent-primary)',
                fontWeight: 700,
                fontSize: '0.8rem',
                gap: '0.35rem',
                textDecoration: 'none',
              }}
              title="To'lov va ma'lumotlar uchun shaxsiy Telegram"
            >
              <Send size={13} />
              <span>@{TELEGRAM_USERNAME}</span>
            </a>

            {/* Notification Bell */}
            <button
              onClick={() => setIsNotifOpen(true)}
              className="btn btn-secondary btn-sm"
              style={{
                position: 'relative',
                width: '40px',
                height: '40px',
                padding: 0,
                borderRadius: '50%',
              }}
              title="To'lov bildirishnomalari markazi"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-2px',
                    background: 'var(--accent-rust)',
                    color: '#ffffff',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(196, 71, 56, 0.4)',
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="btn btn-secondary btn-sm"
              style={{ width: '40px', height: '40px', padding: 0, borderRadius: '50%' }}
              title="Yorug' / Qorong'i rejim"
            >
              {theme === 'dark' ? <Sun size={17} color="#D4801C" /> : <Moon size={17} />}
            </button>

            {/* User Profile or Login */}
            {currentUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div
                  onClick={() => setIsAuthOpen(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.35rem 0.75rem',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-full)',
                    cursor: 'pointer',
                  }}
                  title={currentUser.authProvider === 'google' ? "Google (Firebase) orqali kirilgan" : "Parol avtomatik saqlangan"}
                >
                  {currentUser.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: currentUser.role === 'owner' ? 'var(--accent-primary)' : 'var(--accent-sage)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                      }}
                    >
                      {currentUser.name.charAt(0)}
                    </div>
                  )}
                  <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {currentUser.name.split(' ')[0]}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--accent-sage)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      <CheckCircle size={10} /> {currentUser.authProvider === 'google' ? 'Google Faol' : 'Parol saqlangan'}
                    </div>
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="btn btn-ghost btn-sm"
                  style={{ padding: '0.45rem', color: 'var(--text-muted)' }}
                  title="Tizimdan chiqish"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="btn btn-primary btn-sm"
                style={{ gap: '0.4rem', fontWeight: 700 }}
              >
                <User size={15} />
                <span>Kirish (Google)</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Modals */}
      <NotificationModal isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
};
