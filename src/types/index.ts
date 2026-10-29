export type UserRole = 'owner' | 'driver' | 'admin';

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  authProvider?: 'phone' | 'google';
  role: UserRole;
  passwordAutoSaved: boolean;
  savedPasswordHash?: string;
  avatar?: string;
  passportSerial?: string;
  driverLicense?: string;
  balance: number;
  totalEarnings?: number;
  totalSpent?: number;
  rating: number;
  activeContractsCount: number;
  createdAt: string;
}

export type FuelCategory = 'Elektromobil' | 'Metan' | 'Benzin' | 'Boshqasi';

export function getCarCategory(fuelType: string): FuelCategory {
  const f = (fuelType || '').toLowerCase();
  if (f.includes('elektr') || f.includes('elektro')) return 'Elektromobil';
  if (f.includes('metan')) return 'Metan';
  if (f.includes('benzin')) return 'Benzin';
  return 'Boshqasi';
}

export interface Car {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  plateNumber: string;
  color: string;
  bodyType: string;
  fuelType: FuelCategory | 'Benzin' | 'Gaz/Metan' | 'Gaz/Propan' | 'Elektr' | 'Gibrid';
  transmission: 'Avtomat' | 'Mexanika';
  engineSize: string;
  mileage: number;
  dailyPrice: number; // UZS
  monthlyDiscountPercent: number;
  deposit: number; // UZS
  minRentalDays: number;
  mileageLimitPerDay: number; // km
  hasGps: boolean;
  hasInsurance: boolean;
  hasAirConditioning: boolean;
  hasTintPermission: boolean;
  hasDashcam: boolean;
  features: string[];
  image: string;
  additionalImages?: string[];
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  status: 'available' | 'rented' | 'maintenance';
  location: string;
  description: string;
  currentDriver?: {
    driverId: string;
    driverName: string;
    driverPhone: string;
    contractId: string;
    nextPaymentDate: string;
    paymentStatus: 'paid' | 'due_today' | 'overdue';
  };
  createdAt: string;
}

export type PaymentStatus = 'paid' | 'due_today' | 'overdue' | 'pending';

export interface RentalContract {
  id: string;
  contractNumber: string;
  carId: string;
  carTitle: string;
  carPlate: string;
  carImage: string;
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  driverLicense: string;
  startDate: string;
  endDate: string;
  dailyRate: number; // UZS
  depositAmount: number; // UZS
  paymentFrequency: 'daily' | 'weekly' | 'monthly';
  nextPaymentDate: string;
  paymentStatus: PaymentStatus;
  totalPaid: number;
  overdueDays: number;
  penaltyFee: number;
  gpsTrackingActive: boolean;
  currentLocation?: string;
  driverAvatar?: string;
  driverPassport?: string;
  ownerPassport?: string;
  contractScanImage?: string;
  paymentHistory: {
    id: string;
    date: string;
    amount: number;
    method: 'Click' | 'Payme' | 'Uzum' | 'Naqd';
    status: 'success' | 'pending';
  }[];
}

export interface NotificationItem {
  id: string;
  type: 'payment_reminder' | 'payment_received' | 'car_added' | 'contract_created' | 'system_alert';
  title: string;
  message: string;
  recipientRole: 'owner' | 'driver' | 'both';
  recipientId?: string;
  recipientPhone?: string;
  carId?: string;
  carPlate?: string;
  contractId?: string;
  amount?: number;
  dueDate?: string;
  isRead: boolean;
  sentAt: string;
  smsDelivered: boolean;
  channel: 'in_app' | 'sms' | 'dual';
}
