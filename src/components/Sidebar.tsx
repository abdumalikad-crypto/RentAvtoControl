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
  Send,
  Building2,
  User,
  Home,
  CheckCircle,
  Menu,
  X,
  Volume2,
  VolumeX,
  CreditCard,
  Sparkles
} from 'lucide-react';
import { NotificationModal } from '@/components/NotificationModal';
import { TELEGRAM_USERNAME, TELEGRAM_PROFILE_URL, formatUzSum } from '@/lib/telegram';

export const Sidebar = () => {
  const pathname = usePathname();
  const {
    currentUser,
    unreadCount,
    logout,
    theme,
    toggleTheme,
    isSoundEnabled,
    toggleSound,
  } = useApp();

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const closeMobile = () => setIsMobileOpen(false);

  const navItems = [
    {
      label: 'Bosh Sahifa',
      href: '/',
      icon: Home,
    },
    {
      label: 'Barcha Mashinalar',
      href: '/cars',
      icon: Car,
    },
    {
      label: 'Mashina Qo\'shish',
      href: '/add-car',
      icon: PlusCircle,
      badge: currentUser?.role !== 'owner' && currentUser?.role !== 'admin' ? 'Arendator' : undefined,
      badgeColor: 'var(--accent-rust)',
    },
    {
      label: 'Shartnomalar & To\'lov',
      href: '/contracts',
      icon: FileText,
    },
    {
      label: 'Boshqaruv Paneli',
      href: '/admin',
      icon: Shield,
    },
  ];

  return (
    <>
      {/* MOBILE TOP BAR (visible only on screens < 1024px) */}
      <div className="mobile-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="btn btn-secondary btn-sm"
            style={{ width: '40px', height: '40px', padding: 0 }}
            aria-label="Menyu"
          >
            {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'var(--accent-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
              }}
            >
              <Car size={18} />
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              Rent<span style={{ color: 'var(--accent-primary)' }}>Avto</span>Control
            </span>
          </Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => setIsNotifOpen(true)}
            className="btn btn-secondary btn-sm"
            style={{ position: 'relative', width: '38px', height: '38px', padding: 0 }}
            title="Bildirishnomalar"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="notif-badge">{unreadCount}</span>
            )}
          </button>

          {currentUser?.avatar ? (
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: currentUser?.role === 'owner' ? 'var(--accent-primary)' : 'var(--accent-sage)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.8rem',
              }}
            >
              {currentUser?.name?.charAt(0) || 'U'}
            </div>
          )}
        </div>
      </div>

      {/* MOBILE BACKDROP OVERLAY */}
      {isMobileOpen && (
        <div
          className="mobile-backdrop"
          onClick={closeMobile}
        />
      )}

      {/* SIDEBAR MAIN COMPONENT */}
      <aside className={`site-sidebar ${isMobileOpen ? 'mobile-active' : ''}`}>
        {/* 1. TOP BRAND HEADER */}
        <div className="sidebar-brand">
          <Link href="/" onClick={closeMobile} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="sidebar-logo-icon">
              <Car size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span className="sidebar-brand-name">
                  Rent<span style={{ color: 'var(--accent-primary)' }}>Avto</span>Control
                </span>
                <span className="badge badge-terracotta" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                  PRO
                </span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Avto-Ijara Boshqaruv Tizimi
              </div>
            </div>
          </Link>
        </div>

        {/* 2. CURRENT LOGGED IN USER PROFILE CARD */}
        {currentUser && (
          <div className="sidebar-profile-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.65rem' }}>
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-medium)' }}
                />
              ) : (
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: currentUser.role === 'owner' ? 'var(--accent-primary)' : 'var(--accent-sage)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1rem',
                  }}
                >
                  {currentUser.name.charAt(0)}
                </div>
              )}

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: '0.92rem',
                    color: 'var(--text-primary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  title={currentUser.name}
                >
                  {currentUser.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                  {currentUser.role === 'owner' && (
                    <span className="badge badge-terracotta" style={{ fontSize: '0.7rem', padding: '0.1rem 0.45rem' }}>
                      <Building2 size={11} style={{ marginRight: '3px' }} /> Arendator
                    </span>
                  )}
                  {currentUser.role === 'driver' && (
                    <span className="badge badge-sage" style={{ fontSize: '0.7rem', padding: '0.1rem 0.45rem' }}>
                      <Car size={11} style={{ marginRight: '3px' }} /> Haydovchi
                    </span>
                  )}
                  {currentUser.role === 'admin' && (
                    <span className="badge badge-amber" style={{ fontSize: '0.7rem', padding: '0.1rem 0.45rem' }}>
                      <Shield size={11} style={{ marginRight: '3px' }} /> Bosh Admin
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick balance display */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.45rem 0.65rem',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-input)',
                fontSize: '0.76rem',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <span style={{ color: 'var(--text-secondary)' }}>Balans:</span>
              <span style={{ fontWeight: 800, color: 'var(--accent-sage)', fontFamily: 'var(--font-mono)' }}>
                {currentUser.balance ? formatUzSum(currentUser.balance) : "0 so'm"}
              </span>
            </div>
          </div>
        )}

        {/* 3. NAVIGATION MENU LINKS */}
        <nav className="sidebar-nav">
          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.06em', padding: '0 0.75rem 0.4rem' }}>
            ASOSIY MENYU
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobile}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Icon size={18} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    style={{
                      fontSize: '0.65rem',
                      background: 'rgba(196, 71, 56, 0.15)',
                      color: item.badgeColor || 'var(--accent-rust)',
                      padding: '0.15rem 0.45rem',
                      borderRadius: '4px',
                      fontWeight: 800,
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* 4. UTILITY ACTIONS */}
        <div className="sidebar-utilities">
          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.06em', padding: '0 0.75rem 0.4rem' }}>
            XIZMATLAR & ALOQA
          </div>

          {/* Notifications Button */}
          <button
            onClick={() => {
              setIsNotifOpen(true);
              closeMobile();
            }}
            className="sidebar-action-btn"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Bell size={18} />
              <span>Bildirishnomalar</span>
            </div>
            {unreadCount > 0 && (
              <span className="notif-badge-pill">
                {unreadCount} yangi
              </span>
            )}
          </button>

          {/* Telegram Payment Link */}
          <a
            href={TELEGRAM_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="sidebar-action-btn telegram-btn"
            title="To'lov va yordam uchun shaxsiy Telegram"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Send size={16} />
              <span>To&apos;lov & Aloqa</span>
            </div>
            <span style={{ fontSize: '0.72rem', fontWeight: 700 }}>@{TELEGRAM_USERNAME}</span>
          </a>
        </div>

        {/* 5. SIDEBAR FOOTER (Theme, Sound, Logout) */}
        <div className="sidebar-footer">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <button
              onClick={toggleTheme}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1, marginRight: '0.5rem', gap: '0.4rem', fontSize: '0.8rem', padding: '0.45rem' }}
              title="Yorug' / Tungi rejim"
            >
              {theme === 'dark' ? <Sun size={15} color="#E28F28" /> : <Moon size={15} />}
              <span>{theme === 'dark' ? "Yorug'" : "Tungi"}</span>
            </button>

            <button
              onClick={toggleSound}
              className="btn btn-secondary btn-sm"
              style={{ width: '38px', height: '38px', padding: 0 }}
              title={isSoundEnabled ? "Ovozni o'chirish" : "Ovozni yoqish"}
            >
              {isSoundEnabled ? <Volume2 size={16} color="var(--accent-sage)" /> : <VolumeX size={16} color="var(--text-muted)" />}
            </button>
          </div>

          {/* LOG OUT BUTTON */}
          <button
            onClick={() => {
              closeMobile();
              logout();
            }}
            className="sidebar-logout-btn"
          >
            <LogOut size={16} />
            <span>Tizimdan Chiqish</span>
          </button>
        </div>
      </aside>

      {/* Notification Modal */}
      <NotificationModal isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
    </>
  );
};
