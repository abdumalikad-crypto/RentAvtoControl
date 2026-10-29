'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { CarCard } from '@/components/CarCard';
import {
  Car,
  PlusCircle,
  ShieldCheck,
  Bell,
  Smartphone,
  Users,
  Search,
  CheckCircle,
  TrendingUp,
  Radio,
  ArrowRight,
  Send,
  Zap,
  Building2,
  UserCheck
} from 'lucide-react';
import { NotificationModal } from '@/components/NotificationModal';
import { AuthModal } from '@/components/AuthModal';
import { getCarCategory } from '@/types';
import { TELEGRAM_USERNAME, TELEGRAM_PROFILE_URL } from '@/lib/telegram';

export const Home = () => {
  const {
    cars,
    contracts,
    sendDualPaymentReminder,
    currentUser,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedContractToRemind, setSelectedContractToRemind] = useState(contracts[0]?.id || 'contract-1');

  // Filter cars for preview
  const featuredCars = cars.filter((c) => {
    const matchBrand = selectedBrand === 'all' || c.brand.toLowerCase() === selectedBrand.toLowerCase();
    const matchCategory = selectedCategory === 'all' || getCarCategory(c.fuelType).toLowerCase() === selectedCategory.toLowerCase();
    const matchSearch =
      !searchQuery ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchBrand && matchCategory && matchSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem', paddingBottom: '3rem' }}>
      {/* HERO SECTION */}
      <section
        style={{
          position: 'relative',
          padding: '4.5rem 0 3.5rem',
          background: 'radial-gradient(ellipse at 50% -10%, rgba(196, 89, 43, 0.1) 0%, rgba(248, 246, 241, 0) 70%)',
          borderBottom: '1px solid var(--border-subtle)',
          overflow: 'hidden',
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          {/* Top trust badge */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.45rem 1.15rem',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(196, 89, 43, 0.1)',
                border: '1px solid rgba(196, 89, 43, 0.25)',
                color: 'var(--accent-primary)',
                fontSize: '0.85rem',
                fontWeight: 700,
              }}
            >
              <SparklesIcon />
              <span>RentAvtoControl - O&apos;zbekistonda Arendatorlar va Haydovchilar Avto-Ijara Tizimi</span>
              <a
                href={TELEGRAM_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  marginLeft: '0.5rem',
                  padding: '0.2rem 0.65rem',
                  borderRadius: 'var(--radius-pill)',
                  background: 'var(--accent-primary)',
                  color: '#ffffff',
                  fontSize: '0.75rem',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                <Send size={11} /> To&apos;lov & Aloqa: @{TELEGRAM_USERNAME}
              </a>
            </div>
          </div>

          {/* Main Title & Subtitle */}
          <div style={{ textAlign: 'center', maxWidth: '860px', margin: '0 auto 2.5rem' }}>
            <h1
              style={{
                fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                marginBottom: '1.25rem',
                color: 'var(--text-primary)',
              }}
            >
              Mashinangizni Arendaga Bering yoki{' '}
              <span style={{ background: 'linear-gradient(135deg, #CF6433 0%, #B04B1F 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Ishonchli Mashina
              </span>{' '}
              Mining
            </h1>
            <p
              style={{
                fontSize: '1.1rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                maxWidth: '720px',
                margin: '0 auto',
              }}
            >
              To&apos;lov vaqti kelganda <strong>arendatorga ham, haydovchiga ham</strong> avtomatik xabar boradi. Mashinalarni faqat rasmiy arendatorlar qo&apos;sha oladi, telefon orqali esa parol bir zumda eslab qolinadi.
            </p>
          </div>

          {/* Quick Actions CTA Buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
              marginBottom: '3rem',
            }}
          >
            <Link href="/cars" className="btn btn-primary btn-lg">
              <Car size={18} />
              <span>Barcha Mashinalar Katalogi</span>
            </Link>

            <Link
              href="/add-car"
              className="btn btn-secondary btn-lg"
              style={{
                borderColor: currentUser?.role === 'owner' ? 'var(--accent-primary)' : 'var(--border-medium)',
              }}
            >
              <PlusCircle size={18} color="var(--accent-primary)" />
              <span>Mashina Qo&apos;shish {currentUser?.role === 'owner' ? "(Arendator)" : ""}</span>
            </Link>

            <button
              onClick={() => setIsNotifModalOpen(true)}
              className="btn btn-warning btn-lg pulse-badge"
            >
              <Bell size={18} />
              <span>To&apos;lov Bildirishnomalari</span>
            </button>
          </div>
        </div>
      </section>

      {/* FEATURED CARS MARKETPLACE PREVIEW */}
      <section className="container">
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '1.75rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <span className="badge badge-sage" style={{ marginBottom: '0.5rem' }}>
              Arendadagi Mashinalar
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>
              Hozirda Mavjud Mashinalar Bo&apos;limi
            </h2>
          </div>

          <Link href="/cars" className="btn btn-secondary">
            <span>Barcha mashinalarni ko&apos;rish</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Quick Category Chips: Elektromobil, Metan, Benzin, Boshqasi */}
        <div style={{ display: 'flex', gap: '0.65rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { key: 'all', label: 'Barcha Mashinalar', icon: '🚗' },
            { key: 'elektromobil', label: 'Elektromobil', icon: '⚡' },
            { key: 'metan', label: 'Metan', icon: '🔥' },
            { key: 'benzin', label: 'Benzin', icon: '⛽' },
            { key: 'boshqasi', label: 'Boshqasi', icon: '✨' },
          ].map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`btn btn-sm ${selectedCategory === cat.key ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: 'var(--radius-pill)', fontWeight: 700, gap: '0.35rem' }}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Cars Grid or Clean Empty State */}
        {featuredCars.length > 0 ? (
          <div className="car-grid">
            {featuredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <div
            className="glass-panel"
            style={{
              padding: '3.5rem 2rem',
              textAlign: 'center',
              borderRadius: 'var(--radius-xl)',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                margin: '0 auto 1.25rem',
                borderRadius: '50%',
                background: 'rgba(196, 89, 43, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-primary)',
              }}
            >
              <Car size={32} />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Hozircha Arendaga Mashina Qo&apos;yilmagan
            </h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 1.5rem' }}>
              Siz o&apos;z mashinangizni birinchi bo&apos;lib platformaga joylashtirishingiz va arendaga berishingiz mumkin.
            </p>
            <Link href="/add-car" className="btn btn-primary">
              <PlusCircle size={16} />
              <span>Mashina Qo&apos;shish (Arendator)</span>
            </Link>
          </div>
        )}
      </section>

      {/* Modals */}
      <NotificationModal isOpen={isNotifModalOpen} onClose={() => setIsNotifModalOpen(false)} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
};

function SparklesIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}

export default Home;
