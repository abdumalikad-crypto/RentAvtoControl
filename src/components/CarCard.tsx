'use client';

import React, { useState } from 'react';
import { Car } from '@/types';
import {
  Fuel,
  Gauge,
  ShieldCheck,
  Radio,
  MapPin,
  Calendar,
  CheckCircle,
  Phone,
  Sparkles,
  Zap,
  Info,
  Send
} from 'lucide-react';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import { getTelegramCarBookingUrl, openTelegramChat, TELEGRAM_USERNAME } from '@/lib/telegram';

interface CarCardProps {
  car: Car;
  onBookNow?: (car: Car) => void;
}

export const CarCard = ({ car, onBookNow }: CarCardProps) => {
  const { sendDualPaymentReminder, currentUser, showToast } = useApp();
  const [showDetail, setShowDetail] = useState(false);

  const statusConfig = {
    available: { label: "Bo'sh / Darhol arendaga", class: 'badge-emerald' },
    rented: { label: 'Ijarada / Faol', class: 'badge-amber' },
    maintenance: { label: "Servisda / Ta'mirlashda", class: 'badge-rose' },
  };

  return (
    <>
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Car Image with Badge Overlays */}
        <div style={{ position: 'relative', width: '100%', height: '210px', background: 'var(--bg-surface-elevated)', overflow: 'hidden' }}>
          <img
            src={car.image}
            alt={car.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.4s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
          />

          {/* Top badges */}
          <div
            style={{
              position: 'absolute',
              top: '0.85rem',
              left: '0.85rem',
              right: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              pointerEvents: 'none',
            }}
          >
            <span className={`badge ${statusConfig[car.status].class}`} style={{ backdropFilter: 'blur(8px)' }}>
              {statusConfig[car.status].label}
            </span>

            {/* Uzbek License Plate */}
            <div className="uz-plate">
              <div className="flag-strip">
                <div className="flag-blue"></div>
                <div className="flag-white"></div>
                <div className="flag-green"></div>
              </div>
              <span>{car.plateNumber}</span>
            </div>
          </div>

          {/* Monthly discount pill */}
          {car.monthlyDiscountPercent > 0 && (
            <div
              style={{
                position: 'absolute',
                bottom: '0.75rem',
                left: '0.85rem',
                background: 'rgba(196, 89, 43, 0.9)',
                backdropFilter: 'blur(6px)',
                color: '#ffffff',
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '0.2rem 0.55rem',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              Oylik chegirma -{car.monthlyDiscountPercent}%
            </div>
          )}
        </div>

        {/* Card Body */}
        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {car.title}
              </h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {car.brand} • {car.year}-yil • {car.color}
              </div>
            </div>
          </div>

          {/* Key Specs Pills */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.5rem',
              margin: '0.85rem 0',
              padding: '0.65rem 0',
              borderTop: '1px solid var(--border-subtle)',
              borderBottom: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              <Fuel size={14} color="var(--accent-primary)" />
              <span>{car.fuelType}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              <Gauge size={14} color="var(--accent-amber)" />
              <span>{car.transmission}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              <Radio size={14} color="var(--accent-sage)" />
              <span>{car.hasGps ? 'GPS Starline' : "GPS yo'q"}</span>
            </div>
          </div>

          {/* Owner details badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MapPin size={13} color="var(--text-muted)" />
              <span>{car.location.split(',')[0]}</span>
            </div>
            <div style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>
              Egasi: {car.ownerName.split(' ')[0]}
            </div>
          </div>

          {/* Price and Action Footer */}
          <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                {car.dailyPrice.toLocaleString('uz-UZ')} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)' }}>so&apos;m/kun</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Garov: {car.deposit.toLocaleString('uz-UZ')} so&apos;m
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button
                onClick={() => setShowDetail(true)}
                className="btn btn-secondary btn-sm"
                title="Batafsil ma'lumot"
              >
                <Info size={15} />
              </button>
              <button
                onClick={() => {
                  if (onBookNow) onBookNow(car);
                  else setShowDetail(true);
                }}
                className="btn btn-primary btn-sm"
              >
                Arendaga olish
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Car Detail Modal */}
      {showDetail && (
        <div className="modal-backdrop" onClick={() => setShowDetail(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <div style={{ position: 'relative', width: '100%', height: '260px' }}>
              <img src={car.image} alt={car.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'rgba(0,0,0,0.6)',
                  padding: '0.35rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <div className="uz-plate">
                  <span>{car.plateNumber}</span>
                </div>
              </div>
            </div>

            <div style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.25rem' }}>
                {car.title} ({car.year})
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                {car.description}
              </p>

              {/* Technical Specifications Matrix */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.75rem',
                  background: 'var(--bg-input)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.25rem',
                  fontSize: '0.85rem',
                }}
              >
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Yoqilg&apos;i turi: </span>
                  <strong>{car.fuelType}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Transmissiya: </span>
                  <strong>{car.transmission}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Dvigatel: </span>
                  <strong>{car.engineSize}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Probeg: </span>
                  <strong>{car.mileage.toLocaleString('uz-UZ')} km</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Kunlik limit: </span>
                  <strong>{car.mileageLimitPerDay} km</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Min. ijara muddati: </span>
                  <strong>{car.minRentalDays} kun</strong>
                </div>
              </div>

              {/* Features badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
                {car.features.map((feat, idx) => (
                  <span key={idx} className="badge badge-emerald">
                    <CheckCircle size={12} /> {feat}
                  </span>
                ))}
              </div>

              {/* Owner info */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  background: 'rgba(196, 89, 43, 0.08)',
                  border: '1px solid rgba(196, 89, 43, 0.25)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.25rem',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Arendator (Mashina egasi):</div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{car.ownerName}</div>
                </div>
                <a
                  href={`tel:${car.ownerPhone}`}
                  className="btn btn-secondary btn-sm"
                  style={{ gap: '0.4rem', color: 'var(--accent-primary)', borderColor: 'var(--accent-primary)' }}
                >
                  <Phone size={14} /> {car.ownerPhone}
                </a>
              </div>

              {/* Direct Telegram Booking Notice */}
              <div
                style={{
                  padding: '0.75rem 0.9rem',
                  background: 'rgba(196, 89, 43, 0.08)',
                  border: '1px solid rgba(196, 89, 43, 0.25)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  marginBottom: '1rem',
                  lineHeight: 1.4,
                }}
              >
                Saytdan to&apos;g&apos;ridan-to&apos;g&apos;ri to&apos;lov qilinmaydi. Shartnoma va to&apos;lov rekvizitlari shaxsan <strong>@{TELEGRAM_USERNAME}</strong> orqali beriladi.
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={() => setShowDetail(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  Yopish
                </button>
                <button
                  onClick={() => {
                    if (onBookNow) {
                      setShowDetail(false);
                      onBookNow(car);
                    } else {
                      const url = getTelegramCarBookingUrl({
                        carTitle: car.title,
                        carPlate: car.plateNumber,
                        dailyPrice: car.dailyPrice,
                        rentalDays: car.minRentalDays || 3,
                        deposit: car.deposit,
                        totalAmount: car.dailyPrice * (car.minRentalDays || 3) + car.deposit,
                        driverName: currentUser?.name || 'Mijoz',
                        driverPhone: currentUser?.phone || '',
                      });
                      openTelegramChat(url);
                      showToast(
                        `Telegram ochildi (@${TELEGRAM_USERNAME})`,
                        `${car.title} bo'yicha to'lov va shartnoma uchun @${TELEGRAM_USERNAME} lichkasiga yo'naltirildingiz.`,
                        'info'
                      );
                      setShowDetail(false);
                    }
                  }}
                  className="btn btn-primary"
                  style={{ flex: 2, gap: '0.45rem', fontWeight: 800 }}
                >
                  <Send size={15} />
                  <span>Telegramda Band Qilish (@{TELEGRAM_USERNAME})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
