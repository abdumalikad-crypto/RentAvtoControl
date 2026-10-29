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
  Car
} from 'lucide-react';
import { NotificationModal } from '@/components/NotificationModal';
import { AuthModal } from '@/components/AuthModal';
import { getTelegramPaymentUrl, openTelegramChat, TELEGRAM_USERNAME, formatUzSum } from '@/lib/telegram';

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

  // PRIVACY CHECK: NOT LOGGED IN
  if (!currentUser) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '640px' }}>
        <div
          className="glass-panel"
          style={{
            padding: '3rem 2rem',
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
              background: 'rgba(196, 89, 43, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-primary)',
            }}
          >
            <Lock size={30} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.65rem' }}>
            Shaxsiy Shartnomalarga Kirish
          </h2>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.75rem' }}>
            Har bir foydalanuvchi faqat o&apos;zining rasmiy ijara shartnomasi va to&apos;lov grafigini ko&apos;rishi uchun tizimga kirish talab etiladi. Boshqa shaxslarning ma&apos;lumotlari ko&apos;rinmaydi.
          </p>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', maxWidth: '320px', margin: '0 auto' }}
          >
            <User size={18} />
            <span>Kirish (Google yoki Telefon)</span>
          </button>
        </div>
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </div>
    );
  }

  // STRICT USER FILTER: ONLY CONTRACTS BELONGING TO CURRENT USER
  const userContracts = contracts.filter((c) => {
    if (currentUser.role === 'admin') return true;
    if (currentUser.role === 'owner') {
      return c.ownerId === currentUser.id || c.ownerPhone === currentUser.phone;
    }
    if (currentUser.role === 'driver') {
      return c.driverId === currentUser.id || c.driverPhone === currentUser.phone;
    }
    return false;
  });

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
          marginBottom: '2.5rem',
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span className="badge badge-terracotta">
              <FileText size={13} /> Rasmiy Shartnomalar
            </span>
            <span className="badge badge-sage">
              Faqat Sizning Shartnomalaringiz ({currentUser.name})
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
            Ijara Shartnomalari & To&apos;lov Grafigi
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
            To&apos;lov muddati yetganda avtomatik ravishda arendatorga ham, haydovchiga ham eslatma va to&apos;lov cheki yuboriladi.
          </p>
        </div>

        <button onClick={() => setIsNotifOpen(true)} className="btn btn-warning">
          <Send size={16} />
          <span>To&apos;lov Eslatmalari Markazi</span>
        </button>
      </div>

      {/* Contracts List or Empty State */}
      {userContracts.length === 0 ? (
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
            <FileText size={32} />
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Sizda hozircha faol ijara shartnomasi mavjud emas
          </h3>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 1.5rem' }}>
            {currentUser.role === 'owner'
              ? "Mashinangiz arendaga berilganda, tuzilgan barcha rasmiy shartnomalar, GPS ma'lumotlari va to'lov grafigi aynan shu yerda aks etadi."
              : "Avtomobillar katalogidan o'zingizga mos mashinani tanlang va ijaraga oling. Shartnomangiz shu yerda shakllanadi."}
          </p>
          <Link href={currentUser.role === 'owner' ? '/add-car' : '/cars'} className="btn btn-primary">
            {currentUser.role === 'owner' ? <Car size={16} /> : <Car size={16} />}
            <span>{currentUser.role === 'owner' ? "Mashina Qo'shish (Arendator)" : "Mashinalar Katalogi"}</span>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {userContracts.map((contract) => {
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
                    To&apos;lovlar uning hisobiga tushadi
                  </div>
                </div>

                {/* 3. Haydovchi (Arenda oluvchi) */}
                <div
                  style={{
                    background: 'var(--bg-input)',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-amber)', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                    <UserCheck size={15} /> HAYDOVCHI (ARENDA OLUVCHI)
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{contract.driverName}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                    <Phone size={13} /> {contract.driverPhone}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                    Guvohnoma: {contract.driverLicense}
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

                {/* Dual notification and payment buttons */}
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => sendDualPaymentReminder(contract.id)}
                    className="btn btn-warning btn-sm"
                    title="Sayt va SMS orqali arendatorga ham, haydovchiga ham eslatma yuborish"
                  >
                    <Send size={15} />
                    <span>Har Ikki Tomonga Xabar Yuborish</span>
                  </button>

                  <button
                    onClick={() => setSelectedPaymentContract(contract.id)}
                    className="btn btn-accent btn-sm"
                  >
                    <CreditCard size={15} />
                    <span>To&apos;lovni Qabul Qilish / To&apos;lash</span>
                  </button>
                </div>
              </div>

              {/* Payment Modal if selected */}
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

                  {/* Clarification banner */}
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
                    Saytdan to&apos;g&apos;ridan-to&apos;g&apos;ri (avtomat) to&apos;lov yechilmaydi. To&apos;lov qilish tugmasini bosganingizda to&apos;g&apos;ridan-to&apos;g&apos;ri ma&apos;sul xodimning shaxsiy <strong>Telegram (@{TELEGRAM_USERNAME})</strong> lichkasiga tayyor xabar bilan o&apos;tasiz. Karta rekvizitlariga pul o&apos;tkazib chek yuboriladi.
                  </div>

                  {/* Preset amounts with 10 000 highlighted */}
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
                        placeholder="Masalan: 27-oktabr ijara to'lovi"
                        value={paymentNote}
                        onChange={(e) => setPaymentNote(e.target.value)}
                        className="input-box"
                      />
                    </div>
                  </div>

                  {/* Summary row & Telegram Action */}
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

                          {/* MAIN TELEGRAM BUTTON */}
                          <button
                            type="button"
                            onClick={() => handleTelegramPay(contract, currentEffectiveAmount || 10000)}
                            className="btn btn-primary btn-sm"
                            style={{
                              background: 'var(--accent-primary)',
                              gap: '0.5rem',
                              fontWeight: 800,
                              boxShadow: '0 4px 12px rgba(196, 89, 43, 0.3)',
                            }}
                          >
                            <Send size={15} />
                            <span>Telegram orqali to&apos;lash (@{TELEGRAM_USERNAME})</span>
                          </button>

                          {/* Admin confirmation button */}
                          <button
                            type="button"
                            onClick={() => handleConfirmReceipt(contract.id, currentEffectiveAmount || 10000)}
                            className="btn btn-secondary btn-sm"
                            title="Telegramda chek kelgandan so'ng, tizimda to'langan deb saqlash"
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
        })}
        </div>
      )}

      <NotificationModal isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}
