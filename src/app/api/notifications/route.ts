import { NextResponse } from 'next/server';
import { INITIAL_NOTIFICATIONS, INITIAL_CONTRACTS } from '@/lib/mockData';
import { NotificationItem } from '@/types';

let serverNotifications: NotificationItem[] = [...INITIAL_NOTIFICATIONS];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get('role');
  const userId = searchParams.get('userId');

  let list = [...serverNotifications];

  if (role && role !== 'admin') {
    list = list.filter((n) => n.recipientRole === role || n.recipientRole === 'both');
  }
  if (userId) {
    list = list.filter((n) => !n.recipientId || n.recipientId === userId);
  }

  return NextResponse.json({
    success: true,
    total: list.length,
    notifications: list,
  });
}

// POST: Trigger Dual Payment Reminder for Contract
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { contractId, customMessage } = body;

    const contract = INITIAL_CONTRACTS.find((c) => c.id === contractId);

    if (!contract) {
      return NextResponse.json(
        { success: false, error: 'Shartnoma topilmadi' },
        { status: 404 }
      );
    }

    const timestamp = new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
    const formattedAmount = contract.dailyRate.toLocaleString('uz-UZ');

    // 1. Notification for Owner
    const ownerNotification: NotificationItem = {
      id: `api-notif-owner-${Date.now()}`,
      type: 'payment_reminder',
      title: `🔔 [ARENDATOR] To'lov vaqti yetib keldi!`,
      message: customMessage || `Haydovchi ${contract.driverName} (${contract.carTitle}, ${contract.carPlate}) bo'yicha ${formattedAmount} so'm to'lov vaqti keldi.`,
      recipientRole: 'owner',
      recipientId: contract.ownerId,
      recipientPhone: contract.ownerPhone,
      carId: contract.carId,
      carPlate: contract.carPlate,
      contractId: contract.id,
      amount: contract.dailyRate,
      dueDate: contract.nextPaymentDate,
      isRead: false,
      sentAt: timestamp,
      smsDelivered: true,
      channel: 'dual',
    };

    // 2. Notification for Driver
    const driverNotification: NotificationItem = {
      id: `api-notif-driver-${Date.now()}`,
      type: 'payment_reminder',
      title: `⚠️ [HAYDOVCHI] Ijara to'lovi muddati keldi!`,
      message: `Hurmatli ${contract.driverName}, #${contract.contractNumber} shartnoma bo'yicha ${formattedAmount} so'm to'lov vaqti keldi. Iltimos, o'z vaqtida to'lov qiling.`,
      recipientRole: 'driver',
      recipientId: contract.driverId,
      recipientPhone: contract.driverPhone,
      carId: contract.carId,
      carPlate: contract.carPlate,
      contractId: contract.id,
      amount: contract.dailyRate,
      dueDate: contract.nextPaymentDate,
      isRead: false,
      sentAt: timestamp,
      smsDelivered: true,
      channel: 'dual',
    };

    serverNotifications.unshift(ownerNotification, driverNotification);

    return NextResponse.json({
      success: true,
      message: "To'lov bildirishnomasi arendatorga ham, haydovchiga ham yuborildi!",
      recipients: {
        owner: {
          name: contract.ownerName,
          phone: contract.ownerPhone,
          notification: ownerNotification,
        },
        driver: {
          name: contract.driverName,
          phone: contract.driverPhone,
          notification: driverNotification,
        },
      },
      smsStatus: 'Delivered via Uzbek Telecom Gateway (SMS SIMULATED 200 OK)',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Xabar yuborishda xatolik yuz berdi' },
      { status: 500 }
    );
  }
}
