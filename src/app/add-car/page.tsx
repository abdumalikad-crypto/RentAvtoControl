'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  Car,
  ShieldAlert,
  Building2,
  CheckCircle,
  PlusCircle,
  Upload,
  Sparkles,
  Info,
  DollarSign,
  Radio,
  Fuel,
  Gauge,
  ArrowRight
} from 'lucide-react';

const PRESET_CAR_PHOTOS = [
  { name: 'Chevrolet Tracker 2 (Black)', url: '/cars/tracker.jpg', brand: 'Chevrolet', model: 'Tracker 2 Premier' },
  { name: 'BYD Song Plus EV (White)', url: '/cars/byd_song.jpg', brand: 'BYD', model: 'Song Plus Flagship' },
  { name: 'Chevrolet Malibu 2 Turbo (Grey)', url: '/cars/malibu.jpg', brand: 'Chevrolet', model: 'Malibu 2.0 Turbo' },
  { name: 'Kia K5 GT-Line (White)', url: '/cars/kia_k5.jpg', brand: 'Kia', model: 'K5 GT-Line' },
  { name: 'Chevrolet Cobalt Style AT (White)', url: '/cars/cobalt.jpg', brand: 'Chevrolet', model: 'Cobalt 4-pozitsiya AT' },
];

export default function AddCarPage() {
  const router = useRouter();
  const { currentUser, switchUserRole, addCar, showToast } = useApp();

  // Form states
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('Chevrolet');
  const [model, setModel] = useState('');
  const [year, setYear] = useState(2024);
  const [plateNumber, setPlateNumber] = useState('01 777 AAA');
  const [color, setColor] = useState('Oq (White)');
  const [bodyType, setBodyType] = useState('Sedan');
  const [fuelType, setFuelType] = useState<'Elektromobil' | 'Metan' | 'Benzin' | 'Boshqasi'>('Benzin');
  const [transmission, setTransmission] = useState<'Avtomat' | 'Mexanika'>('Avtomat');
  const [engineSize, setEngineSize] = useState('1.5L');
  const [mileage, setMileage] = useState(15000);
  const [dailyPrice, setDailyPrice] = useState(300000);
  const [monthlyDiscountPercent, setMonthlyDiscountPercent] = useState(10);
  const [deposit, setDeposit] = useState(2500000);
  const [minRentalDays, setMinRentalDays] = useState(3);
  const [mileageLimitPerDay, setMileageLimitPerDay] = useState(250);
  const [hasGps, setHasGps] = useState(true);
  const [hasInsurance, setHasInsurance] = useState(true);
  const [hasAirConditioning, setHasAirConditioning] = useState(true);
  const [hasTintPermission, setHasTintPermission] = useState(true);
  const [hasDashcam, setHasDashcam] = useState(true);
  const [location, setLocation] = useState('Toshkent shahri, Chilonzor tumani');
  const [description, setDescription] = useState('Yangi mashina, arendaga beriladi. Texnik holati alo darajada. GPS Starline ornatilgan.');
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState('/cars/tracker.jpg');
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-fill from preset
  const handleSelectPresetPhoto = (preset: typeof PRESET_CAR_PHOTOS[0]) => {
    setSelectedPhotoUrl(preset.url);
    if (!title) setTitle(preset.name);
    setBrand(preset.brand);
    if (!model) setModel(preset.model);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser || (currentUser.role !== 'owner' && currentUser.role !== 'admin')) {
      showToast(
        "Ruxsat cheklangan!",
        "Bu saytga faqatgina Arendatorlar (mashina egalari) e'lon qo'sha oladi!",
        "error"
      );
      return;
    }

    setIsSubmitting(true);

    const finalImage = customPhotoUrl.trim() || selectedPhotoUrl;

    const result = addCar({
      title: title || `${brand} ${model || 'Avtomobil'}`,
      brand,
      model: model || 'Standard',
      year: Number(year),
      plateNumber: plateNumber.toUpperCase(),
      color,
      bodyType,
      fuelType,
      transmission,
      engineSize,
      mileage: Number(mileage),
      dailyPrice: Number(dailyPrice),
      monthlyDiscountPercent: Number(monthlyDiscountPercent),
      deposit: Number(deposit),
      minRentalDays: Number(minRentalDays),
      mileageLimitPerDay: Number(mileageLimitPerDay),
      hasGps,
      hasInsurance,
      hasAirConditioning,
      hasTintPermission,
      hasDashcam,
      features: [
        hasGps ? 'GPS Starline 24/7' : null,
        hasInsurance ? 'KASKO Sugurta' : null,
        hasTintPermission ? 'Tonirovka ruxsatnomasi bor' : null,
        hasDashcam ? 'Video Registrator' : null,
        hasAirConditioning ? 'Konditsioner' : null,
      ].filter(Boolean) as string[],
      image: finalImage,
      location,
      description,
    });

    setIsSubmitting(false);

    if (result.success) {
      setTimeout(() => {
        router.push('/cars');
      }, 1000);
    }
  };

  // GUARD: If current user is not an owner or admin
  const isOwner = currentUser?.role === 'owner' || currentUser?.role === 'admin';

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem', maxWidth: '980px' }}>
      {/* Title Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span className="badge badge-sage">
            <Building2 size={13} /> Faqat Arendatorlar Uchun
          </span>
        </div>
        <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
          Arendaga Mashina Qo&apos;shish
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
          Avtomobilingizni RentAvtoControl platformasiga joylashtiring. Tizim to&apos;lov vaqti kelganda sizga ham, haydovchingizga ham o&apos;z vaqtida xabar jo&apos;natadi.
        </p>
      </div>

      {/* ROLE GUARD BANNER (if user is driver or guest) */}
      {!isOwner && (
        <div
          style={{
            padding: '1.5rem',
            background: 'rgba(196, 71, 56, 0.08)',
            border: '1.5px solid rgba(196, 71, 56, 0.3)',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'rgba(196, 71, 56, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-rust)',
                flexShrink: 0,
              }}
            >
              <ShieldAlert size={26} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                Diqqat: Ushbu saytga faqatgina Arendatorlar mashina qo&apos;sha oladi!
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Siz hozirda <strong>{currentUser ? currentUser.name + " (Haydovchi)" : "Mehmon"}</strong> profilidasiz. Arendator roliga o&apos;tib o&apos;z mashinangizni bemalol qo&apos;shishingiz mumkin.
              </p>
            </div>
          </div>

          <button
            onClick={() => switchUserRole('owner')}
            className="btn btn-primary"
            style={{ fontWeight: 700 }}
          >
            <Building2 size={16} />
            Arendator Roliga O&apos;tish
          </button>
        </div>
      )}

      {/* ADD CAR FORM */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Step 1: Main Car Details */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Car size={18} color="var(--accent-primary)" />
            1. Avtomobil Asosiy Ma&apos;lumotlari
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            <div className="input-group">
              <label className="input-label">E&apos;lon Sarlavhasi</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Masalan: Chevrolet Tracker 2 Redline"
                className="input-box"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Markasi</label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="input-box"
              >
                <option value="Chevrolet">Chevrolet</option>
                <option value="BYD">BYD</option>
                <option value="Kia">Kia</option>
                <option value="Hyundai">Hyundai</option>
                <option value="Chery">Chery</option>
                <option value="BMW">BMW</option>
                <option value="Mercedes-Benz">Mercedes-Benz</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Modeli va Pozitsiyasi</label>
              <input
                type="text"
                required
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="Tracker 2 Premier"
                className="input-box"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Ishlab Chiqarilgan Yili</label>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="input-box"
              >
                {[2025, 2024, 2023, 2022, 2021, 2020].map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Davlat Raqami (Avto-prevyu)</label>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <input
                  type="text"
                  required
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value)}
                  placeholder="01 A 777 BA"
                  className="input-box"
                  style={{ textTransform: 'uppercase' }}
                />
                {/* Live Uzbek plate preview */}
                <div className="uz-plate">
                  <div className="flag-strip">
                    <div className="flag-blue"></div>
                    <div className="flag-white"></div>
                    <div className="flag-green"></div>
                  </div>
                  <span>{plateNumber || '01 000 AAA'}</span>
                </div>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Rangi</label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="Qora metallik"
                className="input-box"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Kuzov Turi</label>
              <select
                value={bodyType}
                onChange={(e) => setBodyType(e.target.value)}
                className="input-box"
              >
                <option value="Sedan">Sedan</option>
                <option value="Krossover / SUV">Krossover / SUV</option>
                <option value="Xetchbek">Xetchbek</option>
                <option value="Biznes Sedan">Biznes Sedan</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Joylashuvi (Tuman / Shahar)</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Toshkent, Sergeli tumani"
                className="input-box"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Technical Parameters */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Gauge size={18} color="#10b981" />
            2. Texnik Parametrlari
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            <div className="input-group">
              <label className="input-label">Yoqilg&apos;i Turi (Kategoriya)</label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value as any)}
                className="input-box"
              >
                <option value="Elektromobil">⚡ Elektromobil</option>
                <option value="Metan">🔥 Metan</option>
                <option value="Benzin">⛽ Benzin</option>
                <option value="Boshqasi">✨ Boshqasi (Propan / Gibrid)</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Transmissiya</label>
              <select
                value={transmission}
                onChange={(e) => setTransmission(e.target.value as any)}
                className="input-box"
              >
                <option value="Avtomat">Avtomat</option>
                <option value="Mexanika">Mexanika</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Dvigatel Quvvati / Hajmi</label>
              <input
                type="text"
                value={engineSize}
                onChange={(e) => setEngineSize(e.target.value)}
                placeholder="1.2 Turbo (132 ot kuchi)"
                className="input-box"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Hozirgi Probeg (km)</label>
              <input
                type="number"
                value={mileage}
                onChange={(e) => setMileage(Number(e.target.value))}
                placeholder="18000"
                className="input-box"
              />
            </div>
          </div>
        </div>

        {/* Step 3: Financial & Rental Rules */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <DollarSign size={18} color="var(--accent-amber)" />
            3. Moliyaviy Shartlar & Narxlar
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            <div className="input-group">
              <label className="input-label">Kunlik Ijara Narxi (so&apos;m)</label>
              <input
                type="number"
                required
                step="10000"
                value={dailyPrice}
                onChange={(e) => setDailyPrice(Number(e.target.value))}
                placeholder="350000"
                className="input-box"
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 700 }}>
                Kuniga: {dailyPrice.toLocaleString('uz-UZ')} so&apos;m
              </span>
            </div>

            <div className="input-group">
              <label className="input-label">Garov / Depozit Summasi (so&apos;m)</label>
              <input
                type="number"
                required
                step="50000"
                value={deposit}
                onChange={(e) => setDeposit(Number(e.target.value))}
                placeholder="3000000"
                className="input-box"
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Qaytariladigan: {deposit.toLocaleString('uz-UZ')} so&apos;m
              </span>
            </div>

            <div className="input-group">
              <label className="input-label">Oylik Ijara Chegirmasi (%)</label>
              <input
                type="number"
                value={monthlyDiscountPercent}
                onChange={(e) => setMonthlyDiscountPercent(Number(e.target.value))}
                placeholder="15"
                className="input-box"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Kunlik Probeg Limiti (km)</label>
              <input
                type="number"
                value={mileageLimitPerDay}
                onChange={(e) => setMileageLimitPerDay(Number(e.target.value))}
                placeholder="250"
                className="input-box"
              />
            </div>
          </div>
        </div>

        {/* Step 4: Security & Options */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Radio size={18} color="var(--accent-clay)" />
            4. Xavfsizlik & Qo&apos;shimcha Jihozlar
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', background: 'var(--bg-input)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
              <input
                type="checkbox"
                checked={hasGps}
                onChange={(e) => setHasGps(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--accent-primary)' }}
              />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>GPS Treker O&apos;rnatilgan</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Starline 24/7 onlayn nazorat</div>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', background: 'var(--bg-input)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
              <input
                type="checkbox"
                checked={hasInsurance}
                onChange={(e) => setHasInsurance(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--accent-sage)' }}
              />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>KASKO Sug&apos;urta Bor</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>To&apos;liq sug&apos;urta kafolati</div>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', background: 'var(--bg-input)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
              <input
                type="checkbox"
                checked={hasTintPermission}
                onChange={(e) => setHasTintPermission(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--accent-amber)' }}
              />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Tonirovka Ruxsatnomasi</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Orqa/yon oynalar ruxsatli</div>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', background: 'var(--bg-input)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
              <input
                type="checkbox"
                checked={hasDashcam}
                onChange={(e) => setHasDashcam(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--accent-clay)' }}
              />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Video Registrator</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Ikki kamerali yozuv</div>
              </div>
            </label>
          </div>
        </div>

        {/* Step 5: High Resolution Car Photo Selection */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Upload size={18} color="var(--accent-primary)" />
            5. Avtomobil Fotosurati
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Platformadagi professional studiya rasmlaridan birini tanlang yoki o&apos;z rasmingiz havolasini kiriting.
          </p>

          {/* Preset Studio Photos Selection */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.85rem', marginBottom: '1.25rem' }}>
            {PRESET_CAR_PHOTOS.map((preset) => {
              const isSelected = selectedPhotoUrl === preset.url;
              return (
                <div
                  key={preset.url}
                  onClick={() => handleSelectPresetPhoto(preset)}
                  style={{
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-medium)',
                    cursor: 'pointer',
                    background: 'var(--bg-input)',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 4px 15px rgba(196, 89, 43, 0.35)' : 'none',
                  }}
                >
                  <div style={{ height: '100px', width: '100%', overflow: 'hidden' }}>
                    <img src={preset.url} alt={preset.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '0.5rem', fontSize: '0.75rem', fontWeight: 700, textAlign: 'center' }}>
                    {preset.name}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="input-group">
            <label className="input-label">Yoki O&apos;zingizning Rasm Havolangiz (ixtiyoriy)</label>
            <input
              type="url"
              value={customPhotoUrl}
              onChange={(e) => setCustomPhotoUrl(e.target.value)}
              placeholder="https://images.unsplash.com/... yoki rasm URL manzili"
              className="input-box"
            />
          </div>
        </div>

        {/* Description */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.85rem' }}>
            Qo&apos;shimcha Tavsif va Talablar
          </h2>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Mashina qanday holatda, haydovchiga qo'yiladigan talablar (yoshi, staji)..."
            className="input-box"
          />
        </div>

        {/* Submit button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button
            type="button"
            onClick={() => router.push('/cars')}
            className="btn btn-secondary btn-lg"
          >
            Bekor Qilish
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !isOwner}
            className="btn btn-primary btn-lg"
            style={{ minWidth: '240px' }}
          >
            <PlusCircle size={18} />
            <span>{isSubmitting ? "Joylanmoqda..." : "Mashinani E'longa Joylash"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
