'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  FileText,
  Calendar,
  CreditCard,
  Send,
  AlertTriangle,
  CheckCircle2,
  Radio,
  Clock,
  Shield,
  Phone,
  Building2,
  UserCheck,
  MapPin,
  Check,
  Lock,
  User,
  Car,
  FileCheck2,
  Image as ImageIcon,
  Download,
  Search,
  Filter,
  Sparkles,
  ExternalLink,
  Users
} from 'lucide-react';
import { NotificationModal } from '@/components/NotificationModal';
import { AuthModal } from '@/components/AuthModal';
import { ContractImageModal } from '@/components/ContractImageModal';
import { getTelegramPaymentUrl, openTelegramChat, TELEGRAM_USERNAME, formatUzSum } from '@/lib/telegram';
import { RentalContract } from '@/types';

export default function ContractsPage() {
  const {
    contracts,
    sendDualPaymentReminder,
    processPayment,
    showToast,
    currentUser,
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedPaymentContract, setSelectedPaymentContract] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'Click' | 'Payme' | 'Uzum' | 'Naqd'>('Payme');
  const [selectedAmount, setSelectedAmount] = useState<number>(10000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [paymentNote, setPaymentNote] = useState<string>('');

  // Selected Driver & Contract for Image Preview Modal
  const [selectedImageContract, setSelectedImageContract] = useState<RentalContract | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  // Filter & Selection states
  const [selectedDriverId, setSelectedDriverId] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'due_today' | 'paid' | 'overdue'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'accounts' | 'list'>('accounts');

  // Handle open contract in Image format
  const handleOpenContractImage = (contract: RentalContract) => {
    setSelectedImageContract(contract);
    setIsImageModalOpen(true);
  };

  const handleTelegramPay = (contract: any, amountToPay: number) => {
    const url = getTelegramPaymentUrl({
      amount: amountToPay,
      carTitle: contract.carTitle,
      carPlate: contract.carPlate,
      contractNumber: contract.contractNumber,
      driverName: contract.driverName,
      driverPhone: contract.driverPhone,
      purpose: "Ijara to'lovi",
      note: paymentNote || undefined,
    });

    openTelegramChat(url);

    showToast(
      "Telegram ochilmoqda (@gv_up20)...",
      `${formatUzSum(amountToPay)} to'lov uchun @${TELEGRAM_USERNAME} lichkasiga yo'naltirildingiz. To'lov rekvizitlarini olish uchun xabarni yuboring.`,
      "info"
    );
  };

  const handleConfirmReceipt = (contractId: string, amount: number) => {
    processPayment(contractId, amount, paymentMethod);
    setSelectedPaymentContract(null);
    showToast(
      "To'lov tizimda tasdiqlandi",
      `${formatUzSum(amount)} to'lov shartnomaga muvaffaqiyatli kiritildi.`,
      "success"
    );
  };

  // Filter contracts based on selection
  const filteredContracts = contracts.filter((c) => {
    const matchDriver = selectedDriverId === 'all' || c.driverId === selectedDriverId;
    const matchStatus = statusFilter === 'all' || c.paymentStatus === statusFilter;
    const matchSearch =
      !searchQuery ||
      c.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.carTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.carPlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.contractNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.ownerName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchDriver && matchStatus && matchSearch;
  });

  // Extract unique driver accounts from contracts
  const driverAccounts = contracts.reduce<Array<{
    driverId: string;
    driverName: string;
    driverPhone: string;
    driverLicense: string;
    driverPassport?: string;
    driverAvatar?: string;
    contract: RentalContract;
  }>>((acc, contract) => {
    if (!acc.some((item) => item.driverId === contract.driverId)) {
      acc.push({
        driverId: contract.driverId,
        driverName: contract.driverName,
        driverPhone: contract.driverPhone,
        driverLicense: contract.driverLicense,
        driverPassport: contract.driverPassport,
        driverAvatar: contract.driverAvatar,
        contract,
      });
    }
    return acc;
  }, []);

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span className="badge badge-terracotta">
              <FileText size={13} /> Rasmiy Shartnomalar
            </span>
            <span className="badge badge-sage">
              <Users size={13} /> Barcha Haydovchilar Akkauntlari
            </span>
            {currentUser && (
              <span className="badge badge-amber">
                Siz: {currentUser.name} ({currentUser.role === 'owner' ? 'Arendator' : currentUser.role === 'driver' ? 'Haydovchi' : 'Admin'})
              </span>
            )}
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
            Ijara Shartnomalari & Haydovchilar Boshqaruvi
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
            Har bir haydovchi bilan tuzilgan ikki tomonlama rasmiy shartnomalar. Haydovchi akkauntini bosing — to&apos;liq shartnoma <strong>rasm shaklida</strong> ochiladi.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button onClick={() => setIsNotifOpen(true)} className="btn btn-warning">
            <Send size={16} />
            <span>To&apos;lov Eslatmalari Markazi</span>
          </button>
          {!currentUser && (
            <button onClick={() => setIsAuthModalOpen(true)} className="btn btn-primary">
              <User size={16} />
              <span>Tizimga Kirish</span>
            </button>
          )}
        </div>
      </div>

      {/* FILTER & SELECTOR SECTION ("shartnoma qismida tanlanadigan bolsin") */}
      <div
        className="glass-panel"
        style={{
          padding: '1.25rem 1.5rem',
          marginBottom: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}
      >
        {/* Row 1: View mode tabs and Search */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          {/* View mode toggle */}
          <div
            style={{
              display: 'flex',
              background: 'var(--bg-input)',
              padding: '3px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <button
              onClick={() => setViewMode('accounts')}
              className={`btn btn-sm ${viewMode === 'accounts' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontWeight: 700 }}
            >
              <Users size={15} />
              <span>Haydovchilar Akkauntlari ({driverAccounts.length})</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontWeight: 700 }}
            >
              <FileText size={15} />
              <span>To&apos;liq Shartnomalar Ro&apos;yxati ({contracts.length})</span>
            </button>
          </div>

          {/* Search Bar */}
          <div style={{ position: 'relative', minWidth: '260px', flex: '1', maxWidth: '380px' }}>
            <Search
              size={16}
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
            />
            <input
              type="text"
              placeholder="Haydovchi, mashina yoki shartnoma №..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-box"
              style={{ paddingLeft: '38px', fontSize: '0.85rem' }}
            />
          </div>
        </div>

        {/* Row 2: DRIVER SELECTOR BUTTONS (Tanlanadigan haydovchilar qismi) */}
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Users size={14} color="var(--accent-primary)" />
            HAYDOVCHILARNI TANLANG:
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              onClick={() => setSelectedDriverId('all')}
              className={`btn btn-sm ${selectedDriverId === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontWeight: 700 }}
            >
              <span>✨ Barcha Haydovchilar ({contracts.length})</span>
            </button>

            {driverAccounts.map((account) => {
              const isSelected = selectedDriverId === account.driverId;
              const isDueToday = account.contract.paymentStatus === 'due_today';
              const isOverdue = account.contract.paymentStatus === 'overdue';

              return (
                <button
                  key={account.driverId}
                  onClick={() => setSelectedDriverId(account.driverId)}
                  className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontWeight: 700,
                    borderColor: isOverdue ? 'var(--accent-rust)' : isDueToday ? 'var(--accent-amber)' : undefined,
                  }}
                >
                  {account.driverAvatar && (
                    <img
                      src={account.driverAvatar}
                      alt={account.driverName}
                      style={{ width: '18px', height: '18px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                  )}
                  <span>{account.driverName}</span>
                  <span style={{ fontSize: '0.72rem', opacity: 0.8 }}>
                    ({account.contract.carPlate})
                  </span>
                  {isOverdue && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-rust)' }}></span>}
                  {isDueToday && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-amber)' }}></span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 3: Status Filters */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Holati bo&apos;yicha:</span>
          {[
            { id: 'all', label: 'Barcha holatlar' },
            { id: 'due_today', label: "Bugun to'lanishi kerak" },
            { id: 'paid', label: "To'langan (Faol)" },
            { id: 'overdue', label: 'Qarzdorlik (Kechikkan)' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id as any)}
              className={`btn btn-xs ${statusFilter === st.id ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* VIEW 1: HAYDOVCHILAR AKKAUNTLARI BO'LIMI (Directly fulfills: "har bir haydovchi bilan qilingan shartnoma bolsin yanai usha haydovchini accaunt va akkauntini bosganda unbilan birga qilingan shartnoma bolsin rasm shaklda") */}
      {viewMode === 'accounts' && (
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={19} color="var(--accent-primary)" />
              Ijara Shartnomasi Tuzilgan Haydovchilar Akkauntlari
            </h2>
            <div style={{ fontSize: '0.82rem', color: 'var(--accent-primary)', fontWeight: 700 }}>
              💡 Haydovchi akkauntini bosing — rasmiy shartnoma rasm shaklida ochiladi
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {filteredContracts.map((contract) => {
              const isDueToday = contract.paymentStatus === 'due_today';
              const isOverdue = contract.paymentStatus === 'overdue';
              const isPaid = contract.paymentStatus === 'paid';

              return (
                <div
                  key={contract.id}
                  onClick={() => handleOpenContractImage(contract)}
                  className="glass-card"
                  style={{
                    padding: '1.5rem',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.25s ease',
                    border: isOverdue
                      ? '1.5px solid var(--accent-rust)'
                      : isDueToday
                      ? '1.5px solid var(--accent-amber)'
                      : '1.5px solid var(--border-medium)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-elevated)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div>
                    {/* Driver Profile Top Header */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <div style={{ position: 'relative' }}>
                          <img
                            src={contract.driverAvatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'}
                            alt={contract.driverName}
                            style={{
                              width: '52px',
                              height: '52px',
                              borderRadius: '50%',
                              objectFit: 'cover',
                              border: '2.5px solid var(--accent-primary)',
                            }}
                          />
                          <span
                            style={{
                              position: 'absolute',
                              bottom: 0,
                              right: 0,
                              width: '14px',
                              height: '14px',
                              borderRadius: '50%',
                              background: '#10b981',
                              border: '2px solid var(--bg-surface)',
                            }}
                          />
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                            {contract.driverName}
                          </h3>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Phone size={12} /> {contract.driverPhone}
                          </div>
                        </div>
                      </div>

                      {/* Status badge */}
                      <div>
                        {isOverdue && (
                          <span className="badge badge-rose pulse-badge" style={{ fontSize: '0.7rem' }}>
                            <AlertTriangle size={12} /> Qarzdor
                          </span>
                        )}
                        {isDueToday && (
                          <span className="badge badge-amber pulse-badge" style={{ fontSize: '0.7rem' }}>
                            <Clock size={12} /> Bugun to&apos;lov
                          </span>
                        )}
                        {isPaid && (
                          <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
                            <CheckCircle2 size={12} /> To&apos;langan
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Driver Credentials Box */}
                    <div
                      style={{
                        background: 'var(--bg-input)',
                        padding: '0.75rem 0.9rem',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '1rem',
                        fontSize: '0.78rem',
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '0.5rem',
                      }}
                    >
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Guvohnoma:</span>
                        <div style={{ fontWeight: 800 }}>{contract.driverLicense}</div>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Pasport:</span>
                        <div style={{ fontWeight: 800 }}>{contract.driverPassport || 'AD 6721094'}</div>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Shartnoma:</span>
                        <div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>#{contract.contractNumber}</div>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>GPS Nazorat:</span>
                        <div style={{ fontWeight: 800, color: 'var(--accent-sage)' }}>Faol (24/7)</div>
                      </div>
                    </div>

                    {/* Assigned Vehicle Card Snippet */}
                    <div
                      style={{
                        display: 'flex',
                        gap: '0.85rem',
                        alignItems: 'center',
                        background: 'var(--bg-surface-elevated)',
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        marginBottom: '1.25rem',
                      }}
                    >
                      <img
                        src={contract.carImage}
                        alt={contract.carTitle}
                        style={{ width: '85px', height: '60px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                      />
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.92rem', marginBottom: '0.2rem' }}>
                          {contract.carTitle}
                        </div>
                        <div className="uz-plate" style={{ fontSize: '0.75rem', padding: '1px 6px' }}>
                          <div className="flag-strip" style={{ width: '7px' }}>
                            <div className="flag-blue"></div>
                            <div className="flag-white"></div>
                            <div className="flag-green"></div>
                          </div>
                          <span>{contract.carPlate}</span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Info snippet */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', marginBottom: '1.25rem' }}>
                      <div>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Kunlik ijara:</span>
                        <div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>
                          {contract.dailyRate.toLocaleString('uz-UZ')} so&apos;m
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Keyingi to&apos;lov:</span>
                        <div style={{ fontWeight: 700, color: isOverdue ? 'var(--accent-rust)' : isDueToday ? 'var(--accent-amber)' : 'var(--text-primary)' }}>
                          {contract.nextPaymentDate}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Main Action Banner: Click to open contract in image format */}
                  <div
                    style={{
                      background: 'linear-gradient(135deg, rgba(196, 89, 43, 0.12), rgba(196, 89, 43, 0.05))',
                      border: '1.5px solid var(--accent-primary)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.75rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <ImageIcon size={18} color="var(--accent-primary)" />
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                        Shartnomani Rasm Shaklida Ko&apos;rish
                      </span>
                    </div>
                    <span className="badge badge-terracotta" style={{ fontSize: '0.7rem' }}>
                      Ochish →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: TO'LIQ SHARTNOMALAR RO'YXATI (With full payment actions & dual reminders) */}
      {viewMode === 'list' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {filteredContracts.length === 0 ? (
            <div
              className="glass-panel"
              style={{
                padding: '3.5rem 2rem',
                textAlign: 'center',
                borderRadius: 'var(--radius-xl)',
              }}
            >
              <FileText size={36} color="var(--accent-primary)" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                Mos keluvchi shartnoma topilmadi
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                Filtrlarni tozalang yoki boshqa haydovchini tanlang.
              </p>
              <button
                onClick={() => {
                  setSelectedDriverId('all');
                  setStatusFilter('all');
                  setSearchQuery('');
                }}
                className="btn btn-secondary btn-sm"
              >
                Filtrlarni Tozalash
              </button>
            </div>
          ) : (
            filteredContracts.map((contract) => {
              const isDueToday = contract.paymentStatus === 'due_today';
              const isOverdue = contract.paymentStatus === 'overdue';
              const isPaid = contract.paymentStatus === 'paid';

              return (
                <div
                  key={contract.id}
                  className="glass-panel"
                  style={{
                    padding: '1.75rem',
                    borderLeft: isOverdue
                      ? '5px solid var(--accent-rust)'
                      : isDueToday
                      ? '5px solid var(--accent-amber)'
                      : '5px solid var(--accent-sage)',
                  }}
                >
                  {/* Top Bar: Contract #, Status, and Car Plate */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '1rem',
                      paddingBottom: '1.25rem',
                      borderBottom: '1px solid var(--border-subtle)',
                      marginBottom: '1.25rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        Shartnoma #{contract.contractNumber}
                      </div>
                      <div className="uz-plate" style={{ fontSize: '0.85rem' }}>
                        <div className="flag-strip">
                          <div className="flag-blue"></div>
                          <div className="flag-white"></div>
                          <div className="flag-green"></div>
                        </div>
                        <span>{contract.carPlate}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {/* Button to open contract in image format */}
                      <button
                        onClick={() => handleOpenContractImage(contract)}
                        className="btn btn-primary btn-xs"
                        style={{ fontWeight: 800, gap: '0.35rem' }}
                      >
                        <ImageIcon size={13} />
                        <span>Rasm Shaklida Ko&apos;rish</span>
                      </button>

                      {isOverdue && (
                        <span className="badge badge-rose pulse-badge">
                          <AlertTriangle size={13} /> Kechikkan (Qarzdorlik)
                        </span>
                      )}
                      {isDueToday && (
                        <span className="badge badge-amber pulse-badge">
                          <Clock size={13} /> Bugun To&apos;lanishi Kerak
                        </span>
                      )}
                      {isPaid && (
                        <span className="badge badge-emerald">
                          <CheckCircle2 size={13} /> To&apos;langan (O&apos;z vaqtida)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Main Content Grid: Car & Both Parties */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                      gap: '1.5rem',
                      marginBottom: '1.5rem',
                    }}
                  >
                    {/* 1. Car & GPS */}
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <img
                        src={contract.carImage}
                        alt={contract.carTitle}
                        style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                      />
                      <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.25rem' }}>
                          {contract.carTitle}
                        </h3>
                        <div style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: 700, marginBottom: '0.35rem' }}>
                          {contract.dailyRate.toLocaleString('uz-UZ')} so&apos;m / kun
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--accent-sage)', fontWeight: 600 }}>
                          <Radio size={13} /> GPS Starline Faol (Nazorat ostida)
                        </div>
                        {contract.currentLocation && (
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
                            <MapPin size={11} /> {contract.currentLocation}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 2. Arendator (Mashina egasi) */}
                    <div
                      style={{
                        background: 'var(--bg-input)',
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-primary)', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                        <Building2 size={15} /> ARENDATOR (MASHINA EGASI)
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{contract.ownerName}</div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                        <Phone size={13} /> {contract.ownerPhone}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                        Pasport: {contract.ownerPassport || 'AA 7845120'}
                      </div>
                    </div>

                    {/* 3. Haydovchi (Arenda oluvchi akkaunt) */}
                    <div
                      style={{
                        background: 'var(--bg-input)',
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-amber)', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                        <UserCheck size={15} /> HAYDOVCHI AKKAUNTI
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{contract.driverName}</div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                        <Phone size={13} /> {contract.driverPhone}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                        Guvohnoma: {contract.driverLicense} | Pasport: {contract.driverPassport || 'AD 6721094'}
                      </div>
                    </div>
                  </div>

                  {/* Payment Schedule & Action Buttons */}
                  <div
                    style={{
                      padding: '1rem 1.25rem',
                      background: 'var(--bg-input)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '1rem',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Keyingi To&apos;lov Sanasi:</span>
                        <div style={{ fontWeight: 800, fontSize: '0.95rem', color: isOverdue ? 'var(--accent-rust)' : isDueToday ? 'var(--accent-amber)' : 'var(--text-primary)' }}>
                          {contract.nextPaymentDate}
                        </div>
                      </div>

                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Garov (Depozit):</span>
                        <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>
                          {contract.depositAmount.toLocaleString('uz-UZ')} so&apos;m
                        </div>
                      </div>

                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Jami To&apos;langan:</span>
                        <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--accent-sage)' }}>
                          {contract.totalPaid.toLocaleString('uz-UZ')} so&apos;m
                        </div>
                      </div>

                      {isOverdue && (
                        <div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--accent-rust)' }}>Kechikkan Jarima:</span>
                          <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--accent-rust)' }}>
                            +{contract.penaltyFee.toLocaleString('uz-UZ')} so&apos;m ({contract.overdueDays} kun)
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Dual notification, image contract and payment buttons */}
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => handleOpenContractImage(contract)}
                        className="btn btn-secondary btn-sm"
                        title="Shartnomani rasm shaklida ko'rish va yuklab olish"
                      >
                        <ImageIcon size={15} color="var(--accent-primary)" />
                        <span>Rasm Shaklida Ochish</span>
                      </button>

                      <button
                        onClick={() => sendDualPaymentReminder(contract.id)}
                        className="btn btn-warning btn-sm"
                        title="Sayt va SMS orqali arendatorga ham, haydovchiga ham eslatma yuborish"
                      >
                        <Send size={15} />
                        <span>Har Ikki Tomonga Xabar</span>
                      </button>

                      <button
                        onClick={() => setSelectedPaymentContract(contract.id)}
                        className="btn btn-accent btn-sm"
                      >
                        <CreditCard size={15} />
                        <span>To&apos;lash (@{TELEGRAM_USERNAME})</span>
                      </button>
                    </div>
                  </div>

                  {/* Payment Subpanel if selected */}
                  {selectedPaymentContract === contract.id && (
                    <div
                      style={{
                        marginTop: '1.25rem',
                        padding: '1.35rem',
                        background: 'var(--bg-surface-elevated)',
                        border: '1.5px solid var(--accent-sage)',
                        borderRadius: 'var(--radius-lg)',
                        animation: 'fadeIn 0.2s ease-out',
                        boxShadow: 'var(--shadow-elevated)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                        <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                          To&apos;lov Miqdorini Tanlang va Telegram (@{TELEGRAM_USERNAME}) orqali to&apos;lang:
                        </div>
                        <span className="badge badge-sage">Shaxsiy Bog&apos;lanish</span>
                      </div>

                      <div
                        style={{
                          padding: '0.85rem 1rem',
                          background: 'rgba(196, 89, 43, 0.08)',
                          border: '1px solid rgba(196, 89, 43, 0.25)',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '0.84rem',
                          color: 'var(--text-secondary)',
                          lineHeight: 1.5,
                          marginBottom: '1rem',
                        }}
                      >
                        <strong style={{ color: 'var(--accent-primary)' }}>Eslatma: </strong>
                        To&apos;lov qilish tugmasini bosganingizda to&apos;g&apos;ridan-to&apos;g&apos;ri ma&apos;sul xodimning shaxsiy <strong>Telegram (@{TELEGRAM_USERNAME})</strong> lichkasiga tayyor xabar bilan o&apos;tasiz.
                      </div>

                      {/* Preset amounts */}
                      <div style={{ marginBottom: '1rem' }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                          Tezkor Summani Tanlang:
                        </div>
                        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                          {[
                            { label: "10 000 so'm (Sinov / Qisman)", val: 10000, highlight: true },
                            { label: "50 000 so'm", val: 50000, highlight: false },
                            { label: "100 000 so'm", val: 100000, highlight: false },
                            { label: `Kunlik ijara: ${contract.dailyRate.toLocaleString('uz-UZ')} so'm`, val: contract.dailyRate, highlight: false },
                          ].map((item) => {
                            const isSelected = selectedAmount === item.val && !customAmount;
                            return (
                              <button
                                key={item.val}
                                type="button"
                                onClick={() => {
                                  setSelectedAmount(item.val);
                                  setCustomAmount('');
                                }}
                                className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                                style={{
                                  position: 'relative',
                                  borderColor: item.highlight ? 'var(--accent-primary)' : undefined,
                                }}
                              >
                                {isSelected && <Check size={14} />}
                                <span>{item.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Custom Amount input */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        <div className="input-group">
                          <label className="input-label">Yoki boshqa summa kiriting (so&apos;m):</label>
                          <input
                            type="number"
                            placeholder="Masalan: 10000 yoki 200000"
                            value={customAmount}
                            onChange={(e) => setCustomAmount(e.target.value)}
                            className="input-box"
                          />
                        </div>

                        <div className="input-group">
                          <label className="input-label">Izoh (ixtiyoriy):</label>
                          <input
                            type="text"
                            placeholder="Masalan: 29-oktabr ijara to'lovi"
                            value={paymentNote}
                            onChange={(e) => setPaymentNote(e.target.value)}
                            className="input-box"
                          />
                        </div>
                      </div>

                      {/* Summary row */}
                      {(() => {
                        const currentEffectiveAmount = customAmount ? Number(customAmount) : selectedAmount;
                        return (
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              flexWrap: 'wrap',
                              gap: '1rem',
                              paddingTop: '0.85rem',
                              borderTop: '1px solid var(--border-subtle)',
                            }}
                          >
                            <div>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>To&apos;lanadigan summa: </span>
                              <strong style={{ fontSize: '1.15rem', color: 'var(--accent-primary)' }}>
                                {formatUzSum(currentEffectiveAmount || 0)}
                              </strong>
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                              <button
                                type="button"
                                onClick={() => setSelectedPaymentContract(null)}
                                className="btn btn-secondary btn-sm"
                              >
                                Bekor qilish
                              </button>

                              <button
                                type="button"
                                onClick={() => handleTelegramPay(contract, currentEffectiveAmount || 10000)}
                                className="btn btn-primary btn-sm"
                                style={{
                                  background: 'var(--accent-primary)',
                                  gap: '0.5rem',
                                  fontWeight: 800,
                                }}
                              >
                                <Send size={15} />
                                <span>Telegram orqali to&apos;lash (@{TELEGRAM_USERNAME})</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleConfirmReceipt(contract.id, currentEffectiveAmount || 10000)}
                                className="btn btn-secondary btn-sm"
                              >
                                <CheckCircle2 size={14} color="var(--accent-sage)" />
                                <span>Chek tasdiqlandi (Tizimga yozish)</span>
                              </button>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Contract in Image Format Modal */}
      <ContractImageModal
        contract={selectedImageContract}
        isOpen={isImageModalOpen}
        onClose={() => {
          setIsImageModalOpen(false);
          setSelectedImageContract(null);
        }}
      />

      <NotificationModal isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}
