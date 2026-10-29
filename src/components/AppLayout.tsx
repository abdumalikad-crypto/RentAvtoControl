'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Sidebar } from '@/components/Sidebar';
import { AuthGateway } from '@/components/AuthGateway';
import { Toast } from '@/components/Toast';
import { Car, Send, ShieldCheck, HeartHandshake, PhoneCall } from 'lucide-react';
import { TELEGRAM_USERNAME, TELEGRAM_PROFILE_URL } from '@/lib/telegram';

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, isHydrated } = useApp();

  // Show clean loader while hydrating from localStorage
  if (!isHydrated) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-app)',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, var(--accent-primary) 0%, #8C3E1B 100%)',
              margin: '0 auto 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 8px 24px rgba(196, 89, 43, 0.35)',
              animation: 'pulse 1.8s infinite',
            }}
          >
            <Car size={30} />
          </div>
          <div style={{ fontWeight: 800, fontSize: '1.35rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            Rent<span style={{ color: 'var(--accent-primary)' }}>Avto</span>Control
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
            Tizim yuklanmoqda...
          </div>
        </div>
      </div>
    );
  }

  // If user is NOT logged in: Show the dedicated Login & Registration screen!
  if (!currentUser) {
    return (
      <>
        <AuthGateway />
        <Toast />
      </>
    );
  }

  // Once authenticated: Render Sidebar + Main Content + Footer
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main-content">
        <main style={{ flex: 1, minHeight: '80vh' }}>{children}</main>
        <Footer />
      </div>
      <Toast />
    </div>
  );
};

function Footer() {
  return (
    <footer
      style={{
        background: 'var(--bg-surface-elevated)',
        borderTop: '1px solid var(--border-subtle)',
        padding: '3rem 0 2rem',
        marginTop: '3.5rem',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            gap: '2rem',
            marginBottom: '2rem',
          }}
        >
          <div style={{ maxWidth: '360px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  background: 'var(--accent-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                }}
              >
                <Car size={16} />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Rent<span style={{ color: 'var(--accent-primary)' }}>Avto</span>Control
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              O&apos;zbekiston bo&apos;ylab mashinalarini ijaraga beruvchi arendatorlar va mas&apos;uliyatli haydovchilarni birlashtiruvchi zamonaviy boshqaruv tizimi.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem' }}>Bo&apos;limlar</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <Link href="/cars">Barcha Mashinalar Katalogi</Link>
              <Link href="/add-car">Mashina Qo&apos;shish (Arendator)</Link>
              <Link href="/contracts">Shartnomalar & To&apos;lovlar</Link>
              <Link href="/admin">Boshqaruv Paneli</Link>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem' }}>Imkoniyatlar</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <span>✓ Arendator va Haydovchiga to&apos;lov eslatmasi</span>
              <span>✓ Faqat arendatorlar mashina qo&apos;shadi</span>
              <span>✓ Telefon orqali avtomatik saqlanuvchi parol</span>
              <span>✓ Ikki tomonlama xavfsiz shartnomalar</span>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem' }}>Aloqa & Yordam</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <a
                href={TELEGRAM_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  color: 'var(--accent-primary)',
                  fontWeight: 700,
                }}
              >
                <Send size={14} /> Telegram: @{TELEGRAM_USERNAME}
              </a>
              <span>Toshkent shahri, Amir Temur shohi, 107</span>
              <span>Telefon: +998 71 200 00 01</span>
              <span>Ish vaqti: 24/7 qo&apos;llab-quvvatlash</span>
            </div>
          </div>
        </div>

        <div
          style={{
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>© 2026 RentAvtoControl. Barcha huquqlar himoyalangan.</div>
          <div>Toshkent, O&apos;zbekiston</div>
        </div>
      </div>
    </footer>
  );
}
