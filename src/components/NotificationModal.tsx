'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Bell,
  X,
  Send,
  CheckCheck,
  Smartphone,
  Calendar,
  CreditCard,
  Volume2,
  VolumeX,
  AlertCircle,
  Building2,
  UserCheck
} from 'lucide-react';
import { getTelegramPaymentUrl, openTelegramChat, TELEGRAM_USERNAME } from '@/lib/telegram';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationModal = ({ isOpen, onClose }: NotificationModalProps) => {
  const {
    notifications,
    contracts,
    sendDualPaymentReminder,
    processPayment,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    showToast,
    isSoundEnabled,
    toggleSound,
    currentUser,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'owner' | 'driver'>('all');
  const [selectedContractId, setSelectedContractId] = useState(contracts[0]?.id || 'contract-1');
  const [isSimulating, setIsSimulating] = useState(false);

  if (!isOpen) return null;

  const filteredNotifs = notifications.filter((n) => {
    if (activeTab === 'owner') return n.recipientRole === 'owner' || n.recipientRole === 'both';
    if (activeTab === 'driver') return n.recipientRole === 'driver' || n.recipientRole === 'both';
    return true;
  });

  const handleTriggerSimulatedReminder = () => {
    setIsSimulating(true);
    sendDualPaymentReminder(selectedContractId);
    setTimeout(() => {
      setIsSimulating(false);
    }, 600);
  };

  const handleQuickPay = (contractId: string, amount: number) => {
    const contract = contracts.find((c) => c.id === contractId);
    const url = getTelegramPaymentUrl({
      amount,
      carTitle: contract?.carTitle,
      carPlate: contract?.carPlate,
      contractNumber: contract?.contractNumber,
      driverName: contract?.driverName,
      driverPhone: contract?.driverPhone,
      purpose: "Eslatma bo'yicha to'lov",
    });

    openTelegramChat(url);

    showToast(
      `Telegram ochilmoqda (@${TELEGRAM_USERNAME})`,
      `${amount.toLocaleString('uz-UZ')} so'm to'lov uchun shaxsiy Telegram lichkaga yo'naltirildingiz. Rekvizitlarni olib to'lovni tasdiqlang.`,
      "info"
    );
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '680px' }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(245, 158, 11, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#f59e0b',
              }}
            >
              <Bell size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                To&apos;lov Bildirishnomalari Markazi
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                To&apos;lov vaqti kelganda arendatorga ham, haydovchiga ham avtomatik xabar yuboriladi
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={toggleSound}
              className="btn btn-secondary btn-sm"
              title={isSoundEnabled ? 'Ovozni o\'chirish' : 'Ovozni yoqish'}
            >
              {isSoundEnabled ? <Volume2 size={16} color="#10b981" /> : <VolumeX size={16} color="#64748b" />}
            </button>
            <button
              onClick={onClose}
              style={{ color: 'var(--text-muted)', padding: '0.4rem' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Live Simulator Test Box */}
        <div
          style={{
            margin: '1.25rem 1.5rem',
            padding: '1.1rem 1.25rem',
            background: 'linear-gradient(135deg, rgba(196, 89, 43, 0.08), rgba(212, 128, 28, 0.06))',
            border: '1px solid rgba(196, 89, 43, 0.25)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.65rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Send size={16} color="var(--accent-primary)" />
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                Jonli Simulyatsiya: To&apos;lov Vaqti Kelganda Xabar Yuborish
              </span>
            </div>
            <span className="badge badge-sage">SMS Gateway Active</span>
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>
            Ushbu tugmani bosganingizda, saytdan <strong>bir vaqtning o&apos;zida ARENDATORGA ham, HAYDOVCHIGA ham</strong> to&apos;lov eslatmasi va SMS xabarnomasi yuboriladi.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <select
              value={selectedContractId}
              onChange={(e) => setSelectedContractId(e.target.value)}
              className="input-box"
              style={{ flex: 1, minWidth: '220px', padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
            >
              {contracts.map((ct) => (
                <option key={ct.id} value={ct.id}>
                  {ct.carTitle} ({ct.carPlate}) - {ct.driverName} ({ct.dailyRate.toLocaleString('uz-UZ')} so&apos;m)
                </option>
              ))}
            </select>

            <button
              onClick={handleTriggerSimulatedReminder}
              disabled={isSimulating}
              className="btn btn-warning btn-sm pulse-badge"
              style={{ fontWeight: 700 }}
            >
              <Send size={15} />
              {isSimulating ? 'Yuborilmoqda...' : 'Har Ikki Tomonga Xabar Yuborish'}
            </button>
          </div>
        </div>

        {/* Tab Switcher & Actions */}
        <div
          style={{
            padding: '0 1.5rem 0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setActiveTab('all')}
              className={`btn btn-sm ${activeTab === 'all' ? 'btn-primary' : 'btn-ghost'}`}
            >
              Barchasi ({notifications.length})
            </button>
            <button
              onClick={() => setActiveTab('owner')}
              className={`btn btn-sm ${activeTab === 'owner' ? 'btn-primary' : 'btn-ghost'}`}
            >
              <Building2 size={14} /> Arendatorga ({notifications.filter((n) => n.recipientRole === 'owner' || n.recipientRole === 'both').length})
            </button>
            <button
              onClick={() => setActiveTab('driver')}
              className={`btn btn-sm ${activeTab === 'driver' ? 'btn-primary' : 'btn-ghost'}`}
            >
              <UserCheck size={14} /> Haydovchiga ({notifications.filter((n) => n.recipientRole === 'driver' || n.recipientRole === 'both').length})
            </button>
          </div>

          <button
            onClick={markAllNotificationsAsRead}
            className="btn btn-ghost btn-sm"
            style={{ fontSize: '0.8rem' }}
          >
            <CheckCheck size={14} /> Barchasini o&apos;qilgan qilish
          </button>
        </div>

        {/* Notification Items List */}
        <div style={{ padding: '1rem 1.5rem', maxHeight: '380px', overflowY: 'auto' }}>
          {filteredNotifs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <AlertCircle size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
              <p>Hozircha bildirishnomalar mavjud emas</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {filteredNotifs.map((item) => {
                const isOwnerMsg = item.recipientRole === 'owner';
                const isDriverMsg = item.recipientRole === 'driver';

                return (
                  <div
                    key={item.id}
                    onClick={() => markNotificationAsRead(item.id)}
                    style={{
                      padding: '1rem 1.15rem',
                      borderRadius: 'var(--radius-md)',
                      background: item.isRead ? 'var(--bg-card)' : 'rgba(196, 89, 43, 0.08)',
                      border: item.isRead ? '1px solid var(--border-subtle)' : '1px solid rgba(196, 89, 43, 0.35)',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '0.4rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {isOwnerMsg ? (
                          <span className="badge badge-terracotta">
                            <Building2 size={12} /> Arendatorga
                          </span>
                        ) : isDriverMsg ? (
                          <span className="badge badge-amber">
                            <UserCheck size={12} /> Haydovchiga
                          </span>
                        ) : (
                          <span className="badge badge-clay">
                            Ikkala tomonga
                          </span>
                        )}

                        {item.smsDelivered && (
                          <span className="badge badge-sage" title="SMS avtomatik tarzda yetkazildi">
                            <Smartphone size={11} /> SMS Yetkazildi
                          </span>
                        )}
                      </div>

                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {item.sentAt}
                      </span>
                    </div>

                    <div style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
                      {item.title}
                    </div>

                    <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '0.5rem' }}>
                      {item.message}
                    </div>

                    {/* Action buttons if contract payment */}
                    {item.contractId && item.amount && (
                      <div
                        style={{
                          marginTop: '0.65rem',
                          paddingTop: '0.65rem',
                          borderTop: '1px solid var(--border-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Calendar size={13} /> Muddat: {item.dueDate || 'Bugun'}
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickPay(item.contractId!, item.amount!);
                          }}
                          className="btn btn-primary btn-sm"
                          style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem', gap: '0.35rem' }}
                        >
                          <Send size={13} /> Telegramda to&apos;lash (@{TELEGRAM_USERNAME}): {item.amount.toLocaleString('uz-UZ')} so&apos;m
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
