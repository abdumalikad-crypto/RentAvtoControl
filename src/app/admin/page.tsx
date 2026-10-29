'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  Shield,
  Building2,
  Users,
  Car,
  Bell,
  Send,
  CheckCircle2,
  AlertTriangle,
  Clock,
  CreditCard,
  DollarSign,
  Phone,
  FileText,
  Search,
  ExternalLink,
  MapPin,
  PlusCircle,
  User,
  Radio,
  Lock,
  ArrowRight
} from 'lucide-react';
import { NotificationModal } from '@/components/NotificationModal';
import { AuthModal } from '@/components/AuthModal';
import { getTelegramPaymentUrl, openTelegramChat, TELEGRAM_USERNAME, formatUzSum } from '@/lib/telegram';

export default function AdminPage() {
  const {
    currentUser,
    users,
    cars,
    contracts,
    sendDualPaymentReminder,
    processPayment,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'my_cars' | 'my_contracts'>('my_cars');
  const [adminSuperTab, setAdminSuperTab] = useState<'all_owners' | 'all_drivers'>('all_owners');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // NOT LOGGED IN STATE
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
            Shaxsiy Boshqaruv Paneliga Kirish
          </h2>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.75rem' }}>
            Har bir foydalanuvchi faqat o&apos;ziga tegishli mashinalar, shartnomalar va to&apos;lov hisobotlarini ko&apos;rishi uchun tizimga kirish talab etiladi. Boshqa foydalanuvchilar ma&apos;lumotlari ko&apos;rinmaydi.
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

  // 1. ARENDATOR (MASHINA EGASI) SHAXSIY KABINETI - FAQAT O'ZIGA TEGISHLI
  if (currentUser.role === 'owner') {
    // ONLY cars owned by THIS current user
    const myCars = cars.filter(
      (c) => c.ownerId === currentUser.id || c.ownerPhone === currentUser.phone
    );

    // ONLY contracts for THIS owner's cars
    const myContracts = contracts.filter(
      (ct) => ct.ownerId === currentUser.id || ct.ownerPhone === currentUser.phone
    );

    const rentedCount = myCars.filter((c) => c.status === 'rented').length;
    const availableCount = myCars.filter((c) => c.status === 'available').length;
    const estimatedMonthlyIncome = myContracts.reduce((sum, ct) => sum + ct.dailyRate * 30, 0);

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
            marginBottom: '2rem',
          }}
        >
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span className="badge badge-terracotta">
                <Building2 size={13} /> Arendator Shaxsiy Paneli
              </span>
              <span className="badge badge-sage">Faqat Sizning Ma&apos;lumotlaringiz</span>
            </div>
            <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
              Xush kelibsiz, {currentUser.name}
            </h1>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
              Ushbu panelda faqat siz qo&apos;shgan mashinalar va ularning ijarachilari aks etadi. Boshqa arendatorlarning ma&apos;lumotlari ko&apos;rsatilmaydi.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link href="/add-car" className="btn btn-primary">
              <PlusCircle size={16} />
              <span>Yangi Mashina Qo&apos;shish</span>
            </Link>
            <button onClick={() => setIsNotifModalOpen(true)} className="btn btn-secondary">
              <Bell size={16} />
              <span>Xabarnomalar</span>
            </button>
          </div>
        </div>

        {/* OWNER PERSONAL STATS ROW */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2rem',
          }}
        >
          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Mening Mashinalarim</span>
              <Car size={18} color="var(--accent-primary)" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
              {myCars.length} ta
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Siz platformaga joylashtirgan
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ijarada (Faol)</span>
              <Clock size={18} color="var(--accent-amber)" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
              {rentedCount} ta
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Haydovchilar boshqaruvida
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Bo&apos;sh (Arendaga tayyor)</span>
              <CheckCircle2 size={18} color="var(--accent-sage)" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-sage)' }}>
              {availableCount} ta
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Yangi mijozlar uchun ochiq
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Mening Balansim</span>
              <DollarSign size={18} color="var(--accent-clay)" />
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {formatUzSum(currentUser.balance || 0)}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent-sage)', fontWeight: 600, marginTop: '0.2rem' }}>
              Oylik tushum: ~{formatUzSum(estimatedMonthlyIncome)}
            </div>
          </div>
        </div>

        {/* TABS SWITCHER: MY CARS vs MY CONTRACTS */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
          <button
            onClick={() => setActiveTab('my_cars')}
            className={`btn btn-sm ${activeTab === 'my_cars' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontWeight: 700 }}
          >
            <Car size={15} />
            <span>Mening Avtoparkim ({myCars.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('my_contracts')}
            className={`btn btn-sm ${activeTab === 'my_contracts' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontWeight: 700 }}
          >
            <FileText size={15} />
            <span>Mening Shartnomalarim & Haydovchilarim ({myContracts.length})</span>
          </button>
        </div>

        {/* TAB 1: MY CARS ONLY */}
        {activeTab === 'my_cars' && (
          <div>
            {myCars.length === 0 ? (
              <div
                className="glass-panel"
                style={{
                  padding: '3.5rem 2rem',
                  textAlign: 'center',
                  borderRadius: 'var(--radius-xl)',
                }}
              >
                <Car size={40} color="var(--accent-primary)" style={{ margin: '0 auto 1rem', opacity: 0.8 }} />
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                  Siz hali birorta mashina qo&apos;shmadingiz
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '460px', margin: '0 auto 1.5rem' }}>
                  Arendaga bermoqchi bo&apos;lgan transport vositangizni tizimga joylashtiring. U darhol katalogda va shaxsiy kabinetingizda ko&apos;rinadi.
                </p>
                <Link href="/add-car" className="btn btn-primary">
                  <PlusCircle size={16} />
                  <span>Birinchi Mashinani Qo&apos;shish</span>
                </Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {myCars.map((car) => (
                  <div key={car.id} className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                      <img
                        src={car.image}
                        alt={car.title}
                        style={{ width: '100px', height: '70px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 800, fontSize: '1rem' }}>{car.title}</div>
                        <div className="uz-plate" style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
                          <span>{car.plateNumber}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
                      <div>Yoqilg&apos;i: <strong>{car.fuelType}</strong></div>
                      <div>Yili: <strong>{car.year}</strong></div>
                      <div>Kunlik narx: <strong style={{ color: 'var(--accent-primary)' }}>{formatUzSum(car.dailyPrice)}</strong></div>
                      <div>Garov: <strong>{formatUzSum(car.deposit)}</strong></div>
                    </div>

                    <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                      <span className={`badge ${car.status === 'available' ? 'badge-emerald' : car.status === 'rented' ? 'badge-amber' : 'badge-rose'}`}>
                        {car.status === 'available' ? "Bo'sh / Ochiq" : car.status === 'rented' ? 'Ijarada' : "Ta'mirlashda"}
                      </span>
                      <Link href="/cars" className="btn btn-secondary btn-sm">
                        Katalogda ko&apos;rish
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MY CONTRACTS ONLY */}
        {activeTab === 'my_contracts' && (
          <div>
            {myContracts.length === 0 ? (
              <div
                className="glass-panel"
                style={{
                  padding: '3.5rem 2rem',
                  textAlign: 'center',
                  borderRadius: 'var(--radius-xl)',
                }}
              >
                <FileText size={40} color="var(--accent-amber)" style={{ margin: '0 auto 1rem', opacity: 0.8 }} />
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                  Hozircha arenda shartnomalari yo&apos;q
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '460px', margin: '0 auto' }}>
                  Mashinalaringiz ijaraga olinganda ularning shartnomalari, to&apos;lov holati va haydovchi ma&apos;lumotlari aynan shu yerda ko&apos;rinadi.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {myContracts.map((contract) => (
                  <div key={contract.id} className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <strong>Shartnoma #{contract.contractNumber}</strong>
                        <div className="uz-plate" style={{ fontSize: '0.8rem' }}>
                          <span>{contract.carPlate}</span>
                        </div>
                      </div>
                      <span className={`badge ${contract.paymentStatus === 'paid' ? 'badge-emerald' : contract.paymentStatus === 'overdue' ? 'badge-rose' : 'badge-amber'}`}>
                        {contract.paymentStatus === 'paid' ? "To'langan" : contract.paymentStatus === 'overdue' ? 'Kechikkan' : "Bugun to'lanishi kerak"}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem', fontSize: '0.85rem' }}>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Haydovchi:</span>
                        <div style={{ fontWeight: 800 }}>{contract.driverName}</div>
                        <div style={{ color: 'var(--text-secondary)' }}>{contract.driverPhone}</div>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Mashina:</span>
                        <div style={{ fontWeight: 700 }}>{contract.carTitle}</div>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Kunlik to&apos;lov:</span>
                        <div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{formatUzSum(contract.dailyRate)}</div>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Keyingi to&apos;lov sanasi:</span>
                        <div style={{ fontWeight: 700 }}>{contract.nextPaymentDate}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => sendDualPaymentReminder(contract.id)}
                        className="btn btn-warning btn-sm"
                      >
                        <Send size={14} />
                        <span>To&apos;lov Eslatmasi Yuborish</span>
                      </button>
                      <button
                        onClick={() => {
                          const url = getTelegramPaymentUrl({
                            amount: contract.dailyRate,
                            carTitle: contract.carTitle,
                            carPlate: contract.carPlate,
                            contractNumber: contract.contractNumber,
                            driverName: contract.driverName,
                            driverPhone: contract.driverPhone,
                            purpose: "To'lov chekini tekshirish",
                          });
                          openTelegramChat(url);
                        }}
                        className="btn btn-secondary btn-sm"
                      >
                        <Send size={14} />
                        <span>Telegram (@{TELEGRAM_USERNAME})</span>
                      </button>
                      <button
                        onClick={() => {
                          processPayment(contract.id, contract.dailyRate, 'Click');
                          showToast("Chek tasdiqlandi", "To'lov muvaffaqiyatli qabul qilindi deb belgilandi.", "success");
                        }}
                        className="btn btn-accent btn-sm"
                      >
                        <CheckCircle2 size={14} />
                        <span>Chekni Tasdiqlash</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <NotificationModal isOpen={isNotifModalOpen} onClose={() => setIsNotifModalOpen(false)} />
      </div>
    );
  }

  // 2. HAYDOVCHI (ARENDA OLUVCHI) SHAXSIY KABINETI - FAQAT O'ZIGA TEGISHLI
  if (currentUser.role === 'driver') {
    // ONLY contract for THIS driver
    const myContract = contracts.find(
      (ct) => ct.driverId === currentUser.id || ct.driverPhone === currentUser.phone
    );

    return (
      <div className="container" style={{ padding: '2.5rem 1.5rem 5rem', maxWidth: '880px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span className="badge badge-amber">
              <User size={13} /> Haydovchi Shaxsiy Kabineti
            </span>
            <span className="badge badge-sage">Shaxsiy Profilingiz</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
            Salom, {currentUser.name}
          </h1>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
            Sizning arendaga olgan mashinangiz, to&apos;lov jadvali va to&apos;lov muddati.
          </p>
        </div>

        {myContract ? (
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                Faol Shartnoma #{myContract.contractNumber}
              </div>
              <span className={`badge ${myContract.paymentStatus === 'paid' ? 'badge-emerald' : myContract.paymentStatus === 'overdue' ? 'badge-rose' : 'badge-amber'}`}>
                {myContract.paymentStatus === 'paid' ? "To'langan" : myContract.paymentStatus === 'overdue' ? 'Muddati o\'tgan (Qarzdorlik)' : "Bugun to'lanishi kerak"}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <img
                src={myContract.carImage}
                alt={myContract.carTitle}
                style={{ width: '160px', height: '110px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
              />
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                  {myContract.carTitle}
                </h3>
                <div className="uz-plate" style={{ marginBottom: '0.5rem' }}>
                  <span>{myContract.carPlate}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Arendator (Mashina egasi): <strong>{myContract.ownerName}</strong> ({myContract.ownerPhone})
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '1rem',
                background: 'var(--bg-input)',
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.5rem',
              }}
            >
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Kunlik To&apos;lov:</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                  {formatUzSum(myContract.dailyRate)}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Keyingi To&apos;lov Sanasi:</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                  {myContract.nextPaymentDate}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Depozit (Garov):</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                  {formatUzSum(myContract.depositAmount)}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Jami To&apos;langan:</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--accent-sage)' }}>
                  {formatUzSum(myContract.totalPaid)}
                </div>
              </div>
            </div>

            {/* Telegram payment button */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                To&apos;lov saytdan tekkis yechilmaydi. Telegram (@{TELEGRAM_USERNAME}) orqali to&apos;lanadi.
              </div>

              <button
                onClick={() => {
                  const url = getTelegramPaymentUrl({
                    amount: myContract.dailyRate,
                    carTitle: myContract.carTitle,
                    carPlate: myContract.carPlate,
                    contractNumber: myContract.contractNumber,
                    driverName: myContract.driverName,
                    driverPhone: myContract.driverPhone,
                    purpose: "Kunlik ijara to'lovi",
                  });
                  openTelegramChat(url);
                }}
                className="btn btn-primary"
                style={{ fontWeight: 800, gap: '0.5rem' }}
              >
                <Send size={15} />
                <span>Telegram orqali to&apos;lash (@{TELEGRAM_USERNAME}): {formatUzSum(myContract.dailyRate)}</span>
              </button>
            </div>
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
            <Car size={40} color="var(--accent-amber)" style={{ margin: '0 auto 1rem', opacity: 0.8 }} />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Sizda hozircha arendaga olingan mashina yo&apos;q
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '460px', margin: '0 auto 1.5rem' }}>
              Barcha mavjud avtomobillar katalogini ko&apos;rib chiqing, o&apos;zingizga ma&apos;qulini tanlang va bir zumda ijaraga oling.
            </p>
            <Link href="/cars" className="btn btn-primary">
              <Car size={16} />
              <span>Mashinalar Katalogi</span>
            </Link>
          </div>
        )}
      </div>
    );
  }

  // 3. TIZIM BOSH ADMINI (SUPERADMIN REJIMI)
  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <span className="badge badge-clay">
            <Shield size={13} /> Tizim Bosh Admini (Superadmin)
          </span>
        </div>
        <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', fontWeight: 800 }}>
          Umumiy Tizim Nazorati
        </h1>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
          Faqat Bosh Administrator uchun butun tizim bo&apos;yicha arendatorlar va haydovchilar statistikasi.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setAdminSuperTab('all_owners')}
          className={`btn btn-sm ${adminSuperTab === 'all_owners' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Building2 size={14} />
          <span>Barcha Arendatorlar ({users.filter((u) => u.role === 'owner').length})</span>
        </button>
        <button
          onClick={() => setAdminSuperTab('all_drivers')}
          className={`btn btn-sm ${adminSuperTab === 'all_drivers' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Users size={14} />
          <span>Barcha Haydovchilar ({users.filter((u) => u.role === 'driver').length})</span>
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Hozirda tizimda {cars.length} ta mashina va {contracts.length} ta faol shartnoma mavjud.
        </div>
      </div>
    </div>
  );
}
