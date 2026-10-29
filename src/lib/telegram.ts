// Telegram integration configuration and URL builder
export const TELEGRAM_USERNAME = 'gv_up20';
export const TELEGRAM_PROFILE_URL = `https://t.me/${TELEGRAM_USERNAME}`;

export interface TelegramPaymentParams {
  amount: number | string;
  carTitle?: string;
  carPlate?: string;
  contractNumber?: string;
  driverName?: string;
  driverPhone?: string;
  purpose?: string;
  note?: string;
}

export interface TelegramBookingParams {
  carTitle: string;
  carPlate: string;
  dailyPrice: number;
  rentalDays: number;
  deposit: number;
  totalAmount: number;
  driverName: string;
  driverPhone: string;
}

/**
 * Format a number into Uzbek sums string
 */
export function formatUzSum(val: number | string): string {
  const num = typeof val === 'number' ? val : Number(String(val).replace(/\D/g, ''));
  if (isNaN(num)) return `${val} so'm`;
  return `${new Intl.NumberFormat('uz-UZ').format(num)} so'm`;
}

/**
 * Generates a prefilled Telegram DM link for payments
 */
export function getTelegramPaymentUrl({
  amount,
  carTitle,
  carPlate,
  contractNumber,
  driverName,
  driverPhone,
  purpose = "Ijara to'lovi",
  note,
}: TelegramPaymentParams): string {
  const formattedAmount = formatUzSum(amount);

  const lines = [
    "Assalomu alaykum!",
    `Men RentAvtoControl platformasi orqali to'lov qilmoqchiman.`,
    "",
    `💰 To'lov summasi: ${formattedAmount}`,
    purpose ? `📌 To'lov maqsadi: ${purpose}` : null,
    carTitle ? `🚗 Avtomobil: ${carTitle} ${carPlate ? `(${carPlate})` : ''}` : null,
    contractNumber ? `📄 Shartnoma raqami: #${contractNumber}` : null,
    driverName ? `👤 To'lovchi (Haydovchi): ${driverName}` : null,
    driverPhone ? `📞 Telefon: ${driverPhone}` : null,
    note ? `💬 Izoh: ${note}` : null,
    "",
    "Iltimos, to'lov uchun karta raqamini yuboring.",
  ].filter(Boolean);

  const text = lines.join("\n");
  return `https://t.me/${TELEGRAM_USERNAME}?text=${encodeURIComponent(text)}`;
}

/**
 * Generates a prefilled Telegram DM link for booking a car
 */
export function getTelegramCarBookingUrl({
  carTitle,
  carPlate,
  dailyPrice,
  rentalDays,
  deposit,
  totalAmount,
  driverName,
  driverPhone,
}: TelegramBookingParams): string {
  const lines = [
    "Assalomu alaykum!",
    `Men RentAvtoControl saytidan mashinani arendaga olmoqchiman.`,
    "",
    `🚗 Avtomobil: ${carTitle}`,
    `🔢 Davlat raqami: ${carPlate}`,
    `⏱ Ijara muddati: ${rentalDays} kun`,
    `💵 Kunlik ijara: ${formatUzSum(dailyPrice)}`,
    `🛡 Garov (depozit): ${formatUzSum(deposit)}`,
    `💰 Boshlang'ich jami to'lov: ${formatUzSum(totalAmount)}`,
    "",
    `👤 Mijoz: ${driverName || "Foydalanuvchi"}`,
    `📞 Bog'lanish telefoni: ${driverPhone || "Ko'rsatilmagan"}`,
    "",
    "Iltimos, shartnoma tuzish va to'lov rekvizitlarini yuborishingizni so'rayman.",
  ].filter(Boolean);

  const text = lines.join("\n");
  return `https://t.me/${TELEGRAM_USERNAME}?text=${encodeURIComponent(text)}`;
}

/**
 * Open Telegram link in a new window/tab safely
 */
export function openTelegramChat(url: string): void {
  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
