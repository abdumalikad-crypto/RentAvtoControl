import { User, Car, RentalContract, NotificationItem } from '@/types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user-owner-1',
    name: 'Shavkat Ergashev',
    phone: '+998 90 123 45 67',
    role: 'owner',
    passwordAutoSaved: true,
    savedPasswordHash: 'pass_auto_shavkat_2026',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    passportSerial: 'AA 7845120',
    balance: 8450000,
    totalEarnings: 32600000,
    rating: 4.95,
    activeContractsCount: 0,
    createdAt: '2026-01-15',
  },
  {
    id: 'user-owner-2',
    name: 'Nodir Qodirov',
    phone: '+998 97 765 43 21',
    role: 'owner',
    passwordAutoSaved: true,
    savedPasswordHash: 'pass_auto_nodir_998',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    passportSerial: 'AB 9923411',
    balance: 14200000,
    totalEarnings: 58900000,
    rating: 4.88,
    activeContractsCount: 0,
    createdAt: '2026-02-01',
  },
  {
    id: 'user-driver-2',
    name: "Sardor Yo'ldoshev",
    phone: '+998 94 620 33 44',
    role: 'driver',
    passwordAutoSaved: true,
    savedPasswordHash: 'pass_auto_sardor_33',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    passportSerial: 'AD 6721094',
    driverLicense: 'AH 551092',
    balance: 0,
    totalSpent: 8400000,
    rating: 4.6,
    activeContractsCount: 0,
    createdAt: '2026-04-05',
  },
  {
    id: 'user-driver-3',
    name: 'Doniyor Karimjonov',
    phone: '+998 91 333 44 55',
    role: 'driver',
    passwordAutoSaved: true,
    savedPasswordHash: 'pass_auto_doniyor_55',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    passportSerial: 'AE 4410291',
    driverLicense: 'AK 319082',
    balance: 1200000,
    totalSpent: 18500000,
    rating: 5.0,
    activeContractsCount: 0,
    createdAt: '2026-04-12',
  },
  {
    id: 'user-admin-1',
    name: 'RentAvtoControl Bosh Admin',
    phone: '+998 71 200 00 01',
    role: 'admin',
    passwordAutoSaved: true,
    savedPasswordHash: 'admin_secret_secure_key',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    balance: 0,
    rating: 5.0,
    activeContractsCount: 0,
    createdAt: '2026-01-01',
  }
];

// No AI-added mock cars - ready for real cars added by users/owners
export const INITIAL_CARS: Car[] = [];

// No AI-added mock contracts
export const INITIAL_CONTRACTS: RentalContract[] = [];

// Initial notifications
export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];
