'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { CarCard } from '@/components/CarCard';
import { Car, getCarCategory } from '@/types';
import { getTelegramCarBookingUrl, openTelegramChat, TELEGRAM_USERNAME, formatUzSum } from '@/lib/telegram';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Fuel,
  Gauge,
  X,
  Calendar,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Send
} from 'lucide-react';

export default function CarsPage() {
  const { cars, showToast, currentUser } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedFuel, setSelectedFuel] = useState('all');
  const [selectedTransmission, setSelectedTransmission] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [maxPrice, setMaxPrice] = useState(600000);
  const [onlyGps, setOnlyGps] = useState(false);
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'year_desc'>('year_desc');

  // Booking modal state
  const [bookingCar, setBookingCar] = useState<Car | null>(null);
  const [rentalDays, setRentalDays] = useState(7);
  const [driverName, setDriverName] = useState(currentUser?.name || '');
  const [driverPhone, setDriverPhone] = useState(currentUser?.phone || '+998 90 123 45 67');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Filter logic
  const filteredCars = cars
    .filter((car) => {
      const matchSearch =
        !searchQuery ||
        car.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchBrand = selectedBrand === 'all' || car.brand.toLowerCase() === selectedBrand.toLowerCase();
      const matchFuel = selectedFuel === 'all' || getCarCategory(car.fuelType).toLowerCase() === selectedFuel.toLowerCase();
      const matchTransmission = selectedTransmission === 'all' || car.transmission.toLowerCase() === selectedTransmission.toLowerCase();
      const matchStatus = selectedStatus === 'all' || car.status === selectedStatus;
      const matchPrice = car.dailyPrice <= maxPrice;
      const matchGps = !onlyGps || car.hasGps;

      return matchSearch && matchBrand && matchFuel && matchTransmission && matchStatus && matchPrice && matchGps;
    })
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.dailyPrice - b.dailyPrice;
      if (sortBy === 'price_desc') return b.dailyPrice - a.dailyPrice;
      if (sortBy === 'year_desc') return b.year - a.year;
      return 0;
    });

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingCar) return;

    const total = bookingCar.dailyPrice * rentalDays + bookingCar.deposit;
    const url = getTelegramCarBookingUrl({
      carTitle: bookingCar.title,
      carPlate: bookingCar.plateNumber,
      dailyPrice: bookingCar.dailyPrice,
      rentalDays,
      deposit: bookingCar.deposit,
      totalAmount: total,
      driverName: driverName || currentUser?.name || 'Mijoz',
      driverPhone: driverPhone || currentUser?.phone || '+998 90 123 45 67',
    });

    openTelegramChat(url);

    setBookingSuccess(true);
    showToast(
      `Telegram ochildi (@${TELEGRAM_USERNAME})`,
      `${bookingCar.title} bo'yicha to'lov va shartnoma uchun @${TELEGRAM_USERNAME} lichkasiga o'tdingiz. Rekvizitlarni olib to'lov qiling.`,
      "success"
    );

    setTimeout(() => {
      setBookingSuccess(false);
      setBookingCar(null);
    }, 2500);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedBrand('all');
    setSelectedFuel('all');
    setSelectedTransmission('all');
    setSelectedStatus('all');
    setMaxPrice(600000);
    setOnlyGps(false);
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      {/* Page Title Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span className="badge badge-terracotta">Umumiy Katalog</span>
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.6rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
          Arendaga Beriladigan Barcha Mashinalar
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Tasdiqlangan arendatorlar tomonidan qo&apos;yilgan barcha avtomobillar ro&apos;yxati. O&apos;zingizga ma&apos;qul mashinani tanlang va shartnoma tuzing.
        </p>

        {/* Quick Category Chips for: Elektromobil, Metan, Benzin, Boshqasi */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>Kategoriya:</span>
          {[
            { key: 'all', label: 'Barchasi', icon: '🚗' },
            { key: 'elektromobil', label: 'Elektromobil', icon: '⚡' },
            { key: 'metan', label: 'Metan', icon: '🔥' },
            { key: 'benzin', label: 'Benzin', icon: '⛽' },
            { key: 'boshqasi', label: 'Boshqasi', icon: '✨' },
          ].map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setSelectedFuel(cat.key)}
              className={`btn btn-sm ${selectedFuel === cat.key ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: 'var(--radius-pill)', fontWeight: 700, gap: '0.35rem' }}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* FILTER AND SEARCH BAR */}
      <div
        className="glass-panel"
        style={{
          padding: '1.5rem',
          marginBottom: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}
      >
        {/* Search input + Sort */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1', minWidth: '280px' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Model, davlat raqami yoki tuman bo'yicha qidiring (masalan: Tracker, Cobalt, Sergeli)..."
              className="input-box"
              style={{ paddingLeft: '2.5rem' }}
            />
            <Search
              size={18}
              color="var(--text-muted)"
              style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="input-box"
              style={{ width: 'auto', padding: '0.7rem 1rem' }}
            >
              <option value="year_desc">Eng yangi yillar</option>
              <option value="price_asc">Narx: Arzondan qimmatga</option>
              <option value="price_desc">Narx: Qimmatdan arzonga</option>
            </select>

            <button onClick={resetFilters} className="btn btn-secondary" title="Filtrni tozalash">
              <X size={16} />
              <span>Tozalash</span>
            </button>
          </div>
        </div>

        {/* Detailed filters row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          {/* Brand */}
          <div className="input-group">
            <label className="input-label">Markasi</label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="input-box"
            >
              <option value="all">Barcha Markalar</option>
              <option value="chevrolet">Chevrolet</option>
              <option value="byd">BYD</option>
              <option value="kia">Kia</option>
              <option value="hyundai">Hyundai</option>
            </select>
          </div>

          {/* Fuel */}
          <div className="input-group">
            <label className="input-label">Yoqilg&apos;i Turi (Kategoriya)</label>
            <select
              value={selectedFuel}
              onChange={(e) => setSelectedFuel(e.target.value)}
              className="input-box"
            >
              <option value="all">Barcha Kategoriyalar</option>
              <option value="elektromobil">⚡ Elektromobil</option>
              <option value="metan">🔥 Metan</option>
              <option value="benzin">⛽ Benzin</option>
              <option value="boshqasi">✨ Boshqasi (Propan / Gibrid)</option>
            </select>
          </div>

          {/* Transmission */}
          <div className="input-group">
            <label className="input-label">Transmissiya</label>
            <select
              value={selectedTransmission}
              onChange={(e) => setSelectedTransmission(e.target.value)}
              className="input-box"
            >
              <option value="all">Barchasi</option>
              <option value="avtomat">Avtomat</option>
              <option value="mexanika">Mexanika</option>
            </select>
          </div>

          {/* Status */}
          <div className="input-group">
            <label className="input-label">Holati</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="input-box"
            >
              <option value="all">Barcha Mashinalar</option>
              <option value="available">Faqat Bo&apos;sh (Arendaga tayyor)</option>
              <option value="rented">Ijaradagilar</option>
            </select>
          </div>

          {/* Max Daily Price Slider */}
          <div className="input-group">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label className="input-label">Maksimal Kunlik Narx</label>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                {maxPrice.toLocaleString('uz-UZ')} so&apos;m
              </span>
            </div>
            <input
              type="range"
              min="200000"
              max="1000000"
              step="20000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-primary)', marginTop: '0.4rem' }}
            />
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
        }}
      >
        <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
          Topildi: <strong style={{ color: 'var(--text-primary)' }}>{filteredCars.length} ta</strong> arendaga beriladigan mashina
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={onlyGps}
              onChange={(e) => setOnlyGps(e.target.checked)}
              style={{ accentColor: 'var(--accent-sage)' }}
            />
            <span>Faqat GPS o&apos;rnatilganlar</span>
          </label>
        </div>
      </div>

      {/* CAR GRID */}
      {filteredCars.length === 0 ? (
        <div
          className="glass-panel"
          style={{
            padding: '4rem 1.5rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <Filter size={48} color="#64748b" style={{ opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
            Tanlangan filtrlarga mos mashina topilmadi
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '420px' }}>
            Iltimos, narx oralig&apos;ini kengaytiring yoki filtrlarni tozalab qayta urinib ko&apos;ring.
          </p>
          <button onClick={resetFilters} className="btn btn-primary btn-sm">
            Filtrlarni Tozalash
          </button>
        </div>
      ) : (
        <div className="car-grid">
          {filteredCars.map((car) => (
            <CarCard
              key={car.id}
              car={car}
              onBookNow={(selected) => setBookingCar(selected)}
            />
          ))}
        </div>
      )}

      {/* BOOKING MODAL */}
      {bookingCar && (
        <div className="modal-backdrop" onClick={() => setBookingCar(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px' }}>
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                  Avtomobilni Ijaraga Olish A无izasi
                </h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {bookingCar.title} ({bookingCar.plateNumber})
                </div>
              </div>
              <button onClick={() => setBookingCar(null)} style={{ color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '1.5rem' }}>
              {bookingSuccess ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                  <CheckCircle2 size={54} color="var(--accent-sage)" style={{ margin: '0 auto 1rem' }} />
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                    Arizangiz Qabul Qilindi!
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Arendator {bookingCar.ownerName} ({bookingCar.ownerPhone}) bilan shartnoma tasdiqlanishi uchun aloqaga chiqiladi.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  {/* Car Quick summary card */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '1rem',
                      background: 'var(--bg-input)',
                      padding: '0.85rem',
                      borderRadius: 'var(--radius-md)',
                      alignItems: 'center',
                    }}
                  >
                    <img
                      src={bookingCar.image}
                      alt={bookingCar.title}
                      style={{ width: '90px', height: '60px', objectFit: 'cover', borderRadius: '6px' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{bookingCar.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 700 }}>
                        {bookingCar.dailyPrice.toLocaleString('uz-UZ')} so&apos;m / kun
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        Garov (Depozit): {bookingCar.deposit.toLocaleString('uz-UZ')} so&apos;m
                      </div>
                    </div>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Necha Kunga Ijaraga Olasiz?</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {[3, 7, 14, 30].map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setRentalDays(d)}
                          className={`btn btn-sm ${rentalDays === d ? 'btn-primary' : 'btn-secondary'}`}
                          style={{ flex: 1 }}
                        >
                          {d} kun
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Pricing breakdown calculation */}
                  <div
                    style={{
                      padding: '1rem',
                      background: 'rgba(196, 89, 43, 0.08)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid rgba(196, 89, 43, 0.25)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Kunlik ijara ({rentalDays} kun):</span>
                      <span>{(bookingCar.dailyPrice * rentalDays).toLocaleString('uz-UZ')} so&apos;m</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Qaytariladigan garov (depozit):</span>
                      <span>{bookingCar.deposit.toLocaleString('uz-UZ')} so&apos;m</span>
                    </div>
                    <div
                      style={{
                        paddingTop: '0.5rem',
                        marginTop: '0.5rem',
                        borderTop: '1px solid var(--border-subtle)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontWeight: 800,
                        fontSize: '1rem',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <span>Jami boshlang&apos;ich to&apos;lov:</span>
                      <span style={{ color: 'var(--accent-primary)' }}>
                        {(bookingCar.dailyPrice * rentalDays + bookingCar.deposit).toLocaleString('uz-UZ')} so&apos;m
                      </span>
                    </div>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Ism va Familiyangiz</label>
                    <input
                      type="text"
                      required
                      value={driverName}
                      onChange={(e) => setDriverName(e.target.value)}
                      placeholder="Jasur Alimov"
                      className="input-box"
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Telefon Raqamingiz</label>
                    <input
                      type="text"
                      required
                      value={driverPhone}
                      onChange={(e) => setDriverPhone(e.target.value)}
                      placeholder="+998 90 123 45 67"
                      className="input-box"
                    />
                  </div>

                  {/* Telegram Payment Notice */}
                  <div
                    style={{
                      padding: '0.85rem 1rem',
                      background: 'rgba(196, 89, 43, 0.08)',
                      border: '1px solid rgba(196, 89, 43, 0.25)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.82rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.45,
                    }}
                  >
                    <strong style={{ color: 'var(--accent-primary)' }}>To&apos;lov & Shartnoma tartibi: </strong>
                    Saytdan to&apos;g&apos;ridan-to&apos;g&apos;ri (tekkis) pul yechilmaydi. Tugmani bosganingizda ma&apos;sul adminning shaxsiy Telegrami (<strong>@{TELEGRAM_USERNAME}</strong>) ochiladi va to&apos;lov hamda shartnoma bo&apos;yicha rekvizitlar beriladi.
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => setBookingCar(null)}
                      className="btn btn-secondary"
                      style={{ flex: 1 }}
                    >
                      Bekor Qilish
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{
                        flex: 2,
                        gap: '0.5rem',
                        fontWeight: 800,
                        boxShadow: '0 4px 12px rgba(196, 89, 43, 0.3)',
                      }}
                    >
                      <Send size={15} />
                      <span>Telegramda Band Qilish & To&apos;lash (@{TELEGRAM_USERNAME})</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
