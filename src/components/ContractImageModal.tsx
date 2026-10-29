'use client';

import React, { useState, useRef, useEffect } from 'react';
import { RentalContract } from '@/types';
import {
  Download,
  Printer,
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
  CheckCircle2,
  ShieldCheck,
  Building2,
  UserCheck,
  Car,
  Phone,
  Calendar,
  CreditCard,
  Radio,
  FileCheck2,
  QrCode,
  Sparkles
} from 'lucide-react';

interface ContractImageModalProps {
  contract: RentalContract | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ContractImageModal = ({ contract, isOpen, onClose }: ContractImageModalProps) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [viewMode, setViewMode] = useState<'document' | 'image'>('document');
  const [renderedImageUrl, setRenderedImageUrl] = useState<string | null>(null);
  const [isRenderingImage, setIsRenderingImage] = useState<boolean>(false);
  const documentRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Reset zoom on open
  useEffect(() => {
    if (isOpen) {
      setZoomLevel(100);
      setViewMode('document');
      generateContractImage();
    }
  }, [isOpen, contract]);

  if (!isOpen || !contract) return null;

  // Render high-res contract onto Canvas to produce true PNG Image
  const generateContractImage = () => {
    setIsRenderingImage(true);
    const canvas = canvasRef.current || document.createElement('canvas');
    const width = 1100;
    const height = 1520;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setIsRenderingImage(false);
      return;
    }

    // 1. Paper Background & Margins
    ctx.fillStyle = '#faf8f5';
    ctx.fillRect(0, 0, width, height);

    // Decorative Borders
    ctx.strokeStyle = '#c4592b';
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, width - 60, height - 60);

    ctx.strokeStyle = '#2b3942';
    ctx.lineWidth = 1;
    ctx.strokeRect(38, 38, width - 76, height - 76);

    // Watermark
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.rotate(-Math.PI / 6);
    ctx.font = 'bold 52px Inter, sans-serif';
    ctx.fillStyle = 'rgba(196, 89, 43, 0.04)';
    ctx.textAlign = 'center';
    ctx.fillText('RENTAVTO CONTROL • RASMIY SHARTNOMA', 0, 0);
    ctx.fillText('IKKI TOMONLAMA IJARA KELISHUVI', 0, 70);
    ctx.restore();

    // 2. Official Header
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText("O'ZBEKISTON RESPUBLIKASI", width / 2, 85);

    ctx.fillStyle = '#c4592b';
    ctx.font = 'bold 24px Inter, sans-serif';
    ctx.fillText("AVTOMOBILNI IJARAGA BERISH VA TOPSHIRISH SHARTNOMASI", width / 2, 120);

    ctx.fillStyle = '#475569';
    ctx.font = '600 15px Inter, sans-serif';
    ctx.fillText(`Shartnoma Raqami: #${contract.contractNumber} | Ro'yxat sanasi: ${contract.startDate} yil`, width / 2, 148);

    // Divider
    ctx.strokeStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.moveTo(60, 170);
    ctx.lineTo(width - 60, 170);
    ctx.stroke();

    // 3. Parties Box (Arendator & Haydovchi)
    // Box 1: Arendator
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(60, 190, 470, 200);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(60, 190, 470, 200);

    ctx.fillStyle = '#c4592b';
    ctx.font = 'bold 14px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText("1-TOMON: ARENDATOR (MASHINA EGASI)", 80, 220);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.fillText(contract.ownerName, 80, 250);

    ctx.fillStyle = '#475569';
    ctx.font = '13px Inter, sans-serif';
    ctx.fillText(`Pasport ma'lumotlari: ${contract.ownerPassport || 'AA 7845120'}`, 80, 280);
    ctx.fillText(`Telefon raqami: ${contract.ownerPhone}`, 80, 305);
    ctx.fillText("Manzil: Toshkent sh., Ro'yxatdan o'tgan hudud", 80, 330);
    ctx.fillText("Maqomi: Platformada tekshirilgan rasmiy avtomobil egasi", 80, 355);

    // Box 2: Haydovchi (Ijarachi)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(570, 190, 470, 200);
    ctx.strokeStyle = '#e2e8f0';
    ctx.strokeRect(570, 190, 470, 200);

    ctx.fillStyle = '#d97706';
    ctx.font = 'bold 14px Inter, sans-serif';
    ctx.fillText("2-TOMON: IJARACHI (HAYDOVCHI AKKAUNTI)", 590, 220);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.fillText(contract.driverName, 590, 250);

    ctx.fillStyle = '#475569';
    ctx.font = '13px Inter, sans-serif';
    ctx.fillText(`Haydovchilik guvohnomasi: ${contract.driverLicense}`, 590, 280);
    ctx.fillText(`Pasport seriyasi: ${contract.driverPassport || 'AD 6721094'}`, 590, 305);
    ctx.fillText(`Telefon raqami: ${contract.driverPhone}`, 590, 330);
    ctx.fillText("To'lov intizomi: Tizim nazorati ostida (Starline GPS)", 590, 355);

    // 4. Vehicle Details Section
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(60, 420, 980, 340);
    ctx.strokeStyle = '#e2e8f0';
    ctx.strokeRect(60, 420, 980, 340);

    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 15px Inter, sans-serif';
    ctx.fillText("IJARAGA TOPSHIRILGAN AVTOMOBIL PARAMETRLARI", 80, 455);

    // Car info columns
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 18px Inter, sans-serif';
    ctx.fillText(contract.carTitle, 80, 490);

    ctx.fillStyle = '#475569';
    ctx.font = '14px Inter, sans-serif';
    ctx.fillText(`Davlat raqam belgisi: [ ${contract.carPlate} ]`, 80, 525);
    ctx.fillText("Kuzov va Rang: Zavod standarti, toza holatda", 80, 555);
    ctx.fillText("GPS Telemetriya: Starline 24/7 onlayn monitoring tizimi faol", 80, 585);
    ctx.fillText("Sug'urta holati: KASKO va Majburiy fuqarolik javobgarligi sug'urtasi", 80, 615);
    ctx.fillText(`Hozirgi joylashuv: ${contract.currentLocation || 'Toshkent shahri hududi'}`, 80, 645);
    ctx.fillText(`Amal qilish muddati: ${contract.startDate} dan ${contract.endDate} gacha`, 80, 675);

    // Right side car photo box placeholder
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(720, 450, 300, 200);
    ctx.strokeStyle = '#cbd5e1';
    ctx.strokeRect(720, 450, 300, 200);

    // Draw car image on canvas if available
    const carImg = new Image();
    carImg.crossOrigin = 'anonymous';
    carImg.onload = () => {
      try {
        ctx.drawImage(carImg, 720, 450, 300, 200);
        // Stamp on top of car image
        ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
        ctx.fillRect(720, 615, 300, 35);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`DAVLAT RAQAMI: ${contract.carPlate}`, 870, 637);
        setRenderedImageUrl(canvas.toDataURL('image/png'));
      } catch {}
    };
    carImg.src = contract.carImage;

    ctx.fillStyle = '#64748b';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Avtomobil rasmiy fotosurati', 870, 550);
    ctx.textAlign = 'left';

    // 5. Financial & Legal Terms
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(60, 780, 980, 280);
    ctx.strokeStyle = '#e2e8f0';
    ctx.strokeRect(60, 780, 980, 280);

    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 15px Inter, sans-serif';
    ctx.fillText("MOLIYAVIY SHARTLAR VA TO'LOV GRAFIGI", 80, 815);

    // Terms table
    ctx.font = '14px Inter, sans-serif';
    ctx.fillStyle = '#334155';
    ctx.fillText(`• Kunlik ijara narxi:`, 80, 855);
    ctx.font = 'bold 15px Inter, sans-serif';
    ctx.fillStyle = '#c4592b';
    ctx.fillText(`${contract.dailyRate.toLocaleString('uz-UZ')} so'm / kun`, 350, 855);

    ctx.font = '14px Inter, sans-serif';
    ctx.fillStyle = '#334155';
    ctx.fillText(`• Garov (depozit) miqdori:`, 80, 890);
    ctx.font = 'bold 14px Inter, sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.fillText(`${contract.depositAmount.toLocaleString('uz-UZ')} so'm (Shartnoma tugagach qaytariladi)`, 350, 890);

    ctx.font = '14px Inter, sans-serif';
    ctx.fillStyle = '#334155';
    ctx.fillText(`• To'lov grafigi va tartibi:`, 80, 925);
    ctx.fillText(`Har kuni soat 20:00 gacha Click/Payme/Telegram orqali to'lanadi`, 350, 925);

    ctx.fillText(`• Jami to'langan summa:`, 80, 960);
    ctx.font = 'bold 14px Inter, sans-serif';
    ctx.fillStyle = '#059669';
    ctx.fillText(`${contract.totalPaid.toLocaleString('uz-UZ')} so'm`, 350, 960);

    ctx.font = '14px Inter, sans-serif';
    ctx.fillStyle = '#334155';
    ctx.fillText(`• Kechiktirilgan kunlik jarima:`, 80, 995);
    ctx.fillText(`Muddati o'tgan har bir kun uchun +20 000 so'm penya hisoblanadi`, 350, 995);

    ctx.fillText(`• Huquqiy asos:`, 80, 1030);
    ctx.fillText(`O'zbekiston Respublikasi Fuqarolik Kodeksi 535-557 moddalari`, 350, 1030);

    // 6. Signatures and Blue Stamps
    // Arendator Imzosi
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 14px Inter, sans-serif';
    ctx.fillText("MASHINA EGASI (ARENDATOR):", 80, 1100);
    ctx.font = '13px Inter, sans-serif';
    ctx.fillText(contract.ownerName, 80, 1125);

    // Blue ink signature 1
    ctx.strokeStyle = '#1d4ed8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(80, 1160);
    ctx.bezierCurveTo(120, 1130, 160, 1180, 200, 1150);
    ctx.bezierCurveTo(220, 1130, 240, 1170, 270, 1140);
    ctx.stroke();

    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(80, 1175);
    ctx.lineTo(290, 1175);
    ctx.stroke();
    ctx.fillStyle = '#64748b';
    ctx.font = '11px Inter, sans-serif';
    ctx.fillText("(Imzo va sana: 01.03.2026)", 80, 1195);

    // Haydovchi Imzosi
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 14px Inter, sans-serif';
    ctx.fillText("IJARACHI (HAYDOVCHI):", 400, 1100);
    ctx.font = '13px Inter, sans-serif';
    ctx.fillText(contract.driverName, 400, 1125);

    // Blue ink signature 2
    ctx.strokeStyle = '#1d4ed8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(400, 1155);
    ctx.bezierCurveTo(430, 1125, 470, 1175, 510, 1145);
    ctx.bezierCurveTo(530, 1135, 550, 1165, 580, 1135);
    ctx.stroke();

    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(400, 1175);
    ctx.lineTo(600, 1175);
    ctx.stroke();
    ctx.fillStyle = '#64748b';
    ctx.font = '11px Inter, sans-serif';
    ctx.fillText("(Imzo va rozilik bildirish)", 400, 1195);

    // Authentic Blue Circular Stamp "RENTAVTO CONTROL MCHJ"
    const stampX = 850;
    const stampY = 1170;
    const stampR = 75;

    ctx.save();
    ctx.strokeStyle = '#1d4ed8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(stampX, stampY, stampR, 0, Math.PI * 2);
    ctx.stroke();

    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(stampX, stampY, stampR - 8, 0, Math.PI * 2);
    ctx.stroke();

    // Circular Stamp Text
    ctx.fillStyle = '#1d4ed8';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText("RENTAVTO CONTROL MCHJ", stampX, stampY - 45);
    ctx.fillText("★ RASMIY HUJJAT ★", stampX, stampY - 20);
    ctx.font = 'bold 14px Inter, sans-serif';
    ctx.fillText("TASDIQLANDI", stampX, stampY + 5);
    ctx.font = 'bold 10px Inter, sans-serif';
    ctx.fillText("№ RAC-REG-2026", stampX, stampY + 28);
    ctx.fillText("TOSHKENT SHAHRIDA", stampX, stampY + 48);
    ctx.restore();

    // Bottom Barcode & Verification Text
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    for (let x = 60; x < 260; x += 5) {
      const barH = (x % 3 === 0) ? 35 : 25;
      ctx.beginPath();
      ctx.moveTo(x, 1420);
      ctx.lineTo(x, 1420 + barH);
      ctx.stroke();
    }
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 11px Inter, monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`BARCODE: RAC-UZ-${contract.contractNumber}-77810`, 60, 1475);

    ctx.fillStyle = '#64748b';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText("RentAvtoControl elektron tizimi orqali avtomatik shakllantirilgan va yuridik kuchga ega.", width - 60, 1445);
    ctx.fillText("QR-kod orqali platformada haqiqiyligini tekshirish mumkin: https://rentavtocontrol.uz", width - 60, 1465);

    const generated = canvas.toDataURL('image/png');
    setRenderedImageUrl(generated);
    setIsRenderingImage(false);
  };

  // Download contract image directly as PNG
  const handleDownloadImage = () => {
    if (!renderedImageUrl) {
      generateContractImage();
    }
    const downloadUrl = renderedImageUrl || (canvasRef.current ? canvasRef.current.toDataURL('image/png') : null);
    if (!downloadUrl) return;

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `Shartnoma_${contract.contractNumber}_${contract.driverName.replace(/\s+/g, '_')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(10, 15, 20, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '1rem',
        overflowY: 'auto',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Top Floating Action Bar */}
      <div
        style={{
          width: '100%',
          maxWidth: '1000px',
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-lg)',
          padding: '0.75rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          marginBottom: '1rem',
          boxShadow: 'var(--shadow-elevated)',
          position: 'sticky',
          top: '0.5rem',
          zIndex: 1000,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'rgba(196, 89, 43, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-primary)',
            }}
          >
            <FileCheck2 size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontWeight: 800, fontSize: '1rem' }}>
                Shartnoma #{contract.contractNumber} (Rasm Shaklida)
              </span>
              <span className="badge badge-sage">
                <CheckCircle2 size={12} /> Muhrlangan & Tasdiqlangan
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Haydovchi: <strong>{contract.driverName}</strong> | Mashina: <strong>{contract.carTitle}</strong>
            </div>
          </div>
        </div>

        {/* View Toggle & Tools */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {/* Toggle View Mode */}
          <div
            style={{
              display: 'flex',
              background: 'var(--bg-input)',
              borderRadius: 'var(--radius-md)',
              padding: '2px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <button
              onClick={() => setViewMode('document')}
              className={`btn btn-sm ${viewMode === 'document' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
            >
              📄 Hujjat Ko&apos;rinishi
            </button>
            <button
              onClick={() => {
                setViewMode('image');
                if (!renderedImageUrl) generateContractImage();
              }}
              className={`btn btn-sm ${viewMode === 'image' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
            >
              🖼️ Rasm Rejimi (PNG)
            </button>
          </div>

          {/* Zoom controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 15, 60))}
              className="btn btn-secondary btn-sm"
              title="Kichiklashtirish"
              style={{ padding: '0.35rem 0.5rem' }}
            >
              <ZoomOut size={15} />
            </button>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, minWidth: '42px', textAlign: 'center' }}>
              {zoomLevel}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 15, 150))}
              className="btn btn-secondary btn-sm"
              title="Kattalashtirish"
              style={{ padding: '0.35rem 0.5rem' }}
            >
              <ZoomIn size={15} />
            </button>
          </div>

          {/* Download as Image Button */}
          <button
            onClick={handleDownloadImage}
            className="btn btn-primary btn-sm"
            style={{ fontWeight: 800, gap: '0.4rem', boxShadow: '0 2px 10px rgba(196, 89, 43, 0.3)' }}
          >
            <Download size={15} />
            <span>Rasmni Yuklab Olish (PNG)</span>
          </button>

          {/* Print button */}
          <button
            onClick={handlePrint}
            className="btn btn-secondary btn-sm"
            title="Chop etish"
            style={{ padding: '0.35rem 0.6rem' }}
          >
            <Printer size={15} />
          </button>

          {/* Close button */}
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm"
            style={{ padding: '0.35rem 0.5rem' }}
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Hidden offscreen canvas for crisp rendering */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Main Document / Image Presentation Area */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          paddingBottom: '3rem',
          transform: `scale(${zoomLevel / 100})`,
          transformOrigin: 'top center',
          transition: 'transform 0.15s ease-out',
        }}
      >
        {viewMode === 'image' && renderedImageUrl ? (
          /* Pure Image View */
          <div
            style={{
              maxWidth: '920px',
              width: '100%',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
              background: '#fff',
            }}
          >
            <img
              src={renderedImageUrl}
              alt={`Shartnoma #${contract.contractNumber}`}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
        ) : (
          /* High-Resolution Document Canvas & Sheet */
          <div
            ref={documentRef}
            className="printable-contract"
            style={{
              width: '100%',
              maxWidth: '920px',
              background: '#faf8f5',
              color: '#0f172a',
              borderRadius: '8px',
              padding: '2.5rem 3rem',
              boxShadow: '0 25px 70px rgba(0, 0, 0, 0.55)',
              border: '3px solid #c4592b',
              position: 'relative',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {/* Inner Border */}
            <div
              style={{
                position: 'absolute',
                inset: '10px',
                border: '1px solid #94a3b8',
                pointerEvents: 'none',
              }}
            />

            {/* Faint Center Watermark */}
            <div
              style={{
                position: 'absolute',
                top: '45%',
                left: '50%',
                transform: 'translate(-50%, -50%) rotate(-30deg)',
                fontSize: '3.2rem',
                fontWeight: 900,
                color: 'rgba(196, 89, 43, 0.04)',
                textAlign: 'center',
                pointerEvents: 'none',
                userSelect: 'none',
                whiteSpace: 'nowrap',
                lineHeight: 1.3,
              }}
            >
              RENTAVTO CONTROL<br />RASMIY SHARTNOMA
            </div>

            {/* Document Header */}
            <div style={{ textAlign: 'center', marginBottom: '1.75rem', position: 'relative' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.12em', color: '#475569', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                <ShieldCheck size={16} color="#c4592b" />
                O&apos;ZBEKISTON RESPUBLIKASI
              </div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#c4592b', letterSpacing: '-0.02em', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                Avtomobilni Ijaraga Berish va Topshirish Shartnomasi
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.25rem', fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
                <span>Shartnoma №: <strong>#{contract.contractNumber}</strong></span>
                <span>•</span>
                <span>Tuzilgan sana: <strong>{contract.startDate} yil</strong></span>
                <span>•</span>
                <span>Toshkent shahri</span>
              </div>
            </div>

            {/* SECTION 1: TOMONLAR (ARENDATOR VA HAYDOVCHI) */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.65rem', borderBottom: '1.5px solid #cbd5e1', paddingBottom: '0.35rem' }}>
                <span>1-MODDA. SHARTNOMA TOMONLARI</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
                {/* 1.1 Arendator (Mashina egasi) */}
                <div
                  style={{
                    padding: '1rem',
                    background: '#ffffff',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '6px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 800, color: '#c4592b', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                    <Building2 size={14} /> 1-TOMON: ARENDATOR (MASHINA EGASI)
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
                    {contract.ownerName}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.6 }}>
                    <div><strong>Pasport seriyasi:</strong> {contract.ownerPassport || 'AA 7845120'}</div>
                    <div><strong>Bog&apos;lanish telefoni:</strong> {contract.ownerPhone}</div>
                    <div><strong>Yashash manzili:</strong> Toshkent sh., Chilonzor tumani</div>
                    <div><strong>Maqomi:</strong> Platformada tasdiqlangan rasmiy avtomobil egasi</div>
                  </div>
                </div>

                {/* 1.2 Haydovchi (Ijarachi) */}
                <div
                  style={{
                    padding: '1rem',
                    background: '#ffffff',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '6px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 800, color: '#d97706', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                    <UserCheck size={14} /> 2-TOMON: IJARACHI (HAYDOVCHI AKKAUNTI)
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
                    {contract.driverAvatar && (
                      <img
                        src={contract.driverAvatar}
                        alt={contract.driverName}
                        style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #d97706' }}
                      />
                    )}
                    <div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                        {contract.driverName}
                      </div>
                      <span className="badge badge-amber" style={{ fontSize: '0.68rem', padding: '0.15rem 0.4rem' }}>
                        Reyting: ★ 4.95 (Ishonchli)
                      </span>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.6 }}>
                    <div><strong>Guvohnoma raqami:</strong> {contract.driverLicense}</div>
                    <div><strong>Pasport seriyasi:</strong> {contract.driverPassport || 'AD 6721094'}</div>
                    <div><strong>Bog&apos;lanish telefoni:</strong> {contract.driverPhone}</div>
                    <div><strong>Nazorat:</strong> Starline GPS onlayn telemetriyasi ostida</div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: AVTOMOBIL PARAMETRLARI VA FOTOSURATI */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.65rem', borderBottom: '1.5px solid #cbd5e1', paddingBottom: '0.35rem' }}>
                <span>2-MODDA. IJARAGA TOPSHIRILGAN AVTOMOBIL VA FOTO-QAYD</span>
              </div>

              <div
                style={{
                  background: '#ffffff',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '6px',
                  padding: '1.1rem',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '1.25rem',
                  alignItems: 'center',
                }}
              >
                {/* Vehicle Specs Table */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
                    <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a' }}>
                      {contract.carTitle}
                    </div>
                  </div>

                  <div className="uz-plate" style={{ display: 'inline-flex', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                    <div className="flag-strip">
                      <div className="flag-blue"></div>
                      <div className="flag-white"></div>
                      <div className="flag-green"></div>
                    </div>
                    <span>{contract.carPlate}</span>
                  </div>

                  <div style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.7 }}>
                    <div>✓ <strong>Kuzov holati:</strong> Alo darajada, toza topshirilgan</div>
                    <div>✓ <strong>GPS Starline Treker:</strong> O&apos;rnatilgan va 24/7 faol</div>
                    <div>✓ <strong>Sug&apos;urta:</strong> To&apos;liq KASKO sug&apos;urtalangan (Polis bor)</div>
                    <div>✓ <strong>Hozirgi joylashuvi:</strong> {contract.currentLocation || "Toshkent shahri"}</div>
                    <div>✓ <strong>Amal qilish muddati:</strong> {contract.startDate} dan {contract.endDate} gacha</div>
                  </div>
                </div>

                {/* Real Car Photo inside contract */}
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      borderRadius: '6px',
                      overflow: 'hidden',
                      border: '2px solid #cbd5e1',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.12)',
                      maxHeight: '190px',
                      position: 'relative',
                    }}
                  >
                    <img
                      src={contract.carImage}
                      alt={contract.carTitle}
                      style={{ width: '100%', height: '170px', objectFit: 'cover', display: 'block' }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'rgba(15, 23, 42, 0.85)',
                        color: '#fff',
                        padding: '0.3rem 0.5rem',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      <Car size={13} />
                      <span>FOTO-ID: {contract.carPlate} (Tasdiqlangan)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 3: MOLIYAVIY SHARTLAR */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.65rem', borderBottom: '1.5px solid #cbd5e1', paddingBottom: '0.35rem' }}>
                <span>3-MODDA. MOLIYAVIY MAJBURIYATLAR VA TO&apos;LOV TARTIBI</span>
              </div>

              <div
                style={{
                  background: '#ffffff',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '6px',
                  padding: '1rem',
                  fontSize: '0.82rem',
                  color: '#334155',
                  lineHeight: 1.7,
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ padding: '0.65rem', background: '#f8fafc', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Kunlik Ijara Narxi:</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#c4592b' }}>
                      {contract.dailyRate.toLocaleString('uz-UZ')} so&apos;m
                    </div>
                  </div>

                  <div style={{ padding: '0.65rem', background: '#f8fafc', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Garov (Depozit) Summasi:</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>
                      {contract.depositAmount.toLocaleString('uz-UZ')} so&apos;m
                    </div>
                  </div>

                  <div style={{ padding: '0.65rem', background: '#f8fafc', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Jami To&apos;langan:</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#059669' }}>
                      {contract.totalPaid.toLocaleString('uz-UZ')} so&apos;m
                    </div>
                  </div>
                </div>

                <div>
                  <strong>3.1.</strong> Ijarachi haydovchi kunlik to&apos;lovni har kuni soat 20:00 dan kechiktirmay amalga oshirish majburiyatini oladi.<br />
                  <strong>3.2.</strong> To&apos;lov kechiktirilgan taqdirda, har bir kechiktirilgan kun uchun 20 000 so&apos;m miqdorida jarima (penya) qo&apos;shiladi.<br />
                  <strong>3.3.</strong> Avtomobilga o&apos;rnatilgan Starline GPS trekerini o&apos;chirish yoki nosozlik keltirib chiqarish qat&apos;iyan man etiladi.
                </div>
              </div>
            </div>

            {/* SECTION 4: IMZOLAR VA RASMIY MUHR */}
            <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '2px solid #cbd5e1' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
                {/* Arendator Signature */}
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.2rem' }}>
                    ARENDATOR (MASHINA EGASI):
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#475569' }}>
                    {contract.ownerName}
                  </div>
                  <div style={{ margin: '0.6rem 0' }}>
                    {/* Blue cursive signature representation */}
                    <svg width="180" height="45" viewBox="0 0 180 45">
                      <path
                        d="M 10,25 Q 35,5 60,30 T 110,20 T 145,35 T 170,15"
                        fill="none"
                        stroke="#1d4ed8"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <div style={{ width: '180px', height: '1px', background: '#94a3b8' }}></div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.2rem' }}>
                    (Imzo va sana: {contract.startDate})
                  </div>
                </div>

                {/* Haydovchi Signature */}
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.2rem' }}>
                    IJARACHI (HAYDOVCHI):
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#475569' }}>
                    {contract.driverName}
                  </div>
                  <div style={{ margin: '0.6rem 0' }}>
                    <svg width="180" height="45" viewBox="0 0 180 45">
                      <path
                        d="M 10,30 Q 40,8 75,32 T 120,18 T 155,30 T 175,12"
                        fill="none"
                        stroke="#1d4ed8"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <div style={{ width: '180px', height: '1px', background: '#94a3b8' }}></div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.2rem' }}>
                    (Imzo va to&apos;liq rozilik)
                  </div>
                </div>

                {/* Authentic Blue Circular Stamp */}
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      width: '135px',
                      height: '135px',
                      borderRadius: '50%',
                      border: '3px solid #1d4ed8',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#1d4ed8',
                      padding: '8px',
                      boxShadow: '0 0 0 3px rgba(29, 78, 216, 0.1)',
                      transform: 'rotate(-8deg)',
                      background: 'rgba(29, 78, 216, 0.03)',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        inset: '6px',
                        borderRadius: '50%',
                        border: '1px dashed #1d4ed8',
                      }}
                    />
                    <div style={{ fontSize: '0.55rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      RENTAVTO CONTROL MCHJ
                    </div>
                    <div style={{ fontSize: '0.52rem', fontWeight: 800, margin: '2px 0' }}>
                      ★ RASMIY HUJJAT ★
                    </div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 900, letterSpacing: '0.04em' }}>
                      TASDIQLANDI
                    </div>
                    <div style={{ fontSize: '0.55rem', fontWeight: 800, marginTop: '2px' }}>
                      № RAC-REG-2026
                    </div>
                    <div style={{ fontSize: '0.5rem', fontWeight: 700 }}>
                      TOSHKENT SHAHRIDA
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Verification Footer with Barcode */}
            <div
              style={{
                marginTop: '2rem',
                paddingTop: '1rem',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                fontSize: '0.72rem',
                color: '#64748b',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <QrCode size={36} color="#0f172a" />
                <div>
                  <div style={{ fontWeight: 800, color: '#0f172a' }}>
                    QR-KOD: Elektron Davlat Reyestridan Tasdiqlangan
                  </div>
                  <div>Shartnoma identifikatori: RAC-UZ-{contract.contractNumber}</div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div>Ushbu shartnoma elektron tizimda qayd qilingan va ikki tomonlama yuridik kuchga ega.</div>
                <div style={{ fontWeight: 700, color: '#c4592b' }}>RentAvtoControl © 2026 • Barcha huquqlar himoyalangan</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
