'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Car, RentalContract, NotificationItem, UserRole } from '@/types';
import { INITIAL_USERS, INITIAL_CARS, INITIAL_CONTRACTS, INITIAL_NOTIFICATIONS } from '@/lib/mockData';
import { playNotificationChime } from '@/lib/sound';
import { signInWithGooglePopup, signOutFromFirebase } from '@/lib/firebase';

interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
}

interface RegisterParams {
  name: string;
  phone: string;
  password?: string;
  role: UserRole;
}

interface AppContextType {
  currentUser: User | null;
  users: User[];
  cars: Car[];
  contracts: RentalContract[];
  notifications: NotificationItem[];
  unreadCount: number;
  toast: ToastMessage | null;
  isSoundEnabled: boolean;
  isHydrated: boolean;
  toggleSound: () => void;
  showToast: (title: string, message: string, type?: ToastMessage['type']) => void;
  hideToast: () => void;
  switchUserRole: (role: UserRole) => void;
  registerUser: (params: RegisterParams) => { success: boolean; user?: User; error?: string };
  loginUser: (phone: string, password?: string, preferredRole?: UserRole) => { success: boolean; user?: User; error?: string };
  loginWithPhone: (phone: string, name: string, role: UserRole) => { autoPassword: string; user: User };
  loginWithSavedPassword: (phone: string) => boolean;
  loginWithGoogle: (role?: UserRole) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => void;
  addCar: (carData: Omit<Car, 'id' | 'createdAt' | 'ownerId' | 'ownerName' | 'ownerPhone' | 'status'>) => { success: boolean; message: string; car?: Car };
  updateCarStatus: (carId: string, status: Car['status']) => void;
  sendDualPaymentReminder: (contractId: string) => void;
  processPayment: (contractId: string, amount: number, method: 'Click' | 'Payme' | 'Uzum' | 'Naqd') => void;
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_USERS = 'rac_users_v2';
const LOCAL_STORAGE_KEY_CARS = 'rac_cars_v2';
const LOCAL_STORAGE_KEY_CONTRACTS = 'rac_contracts_v2';
const LOCAL_STORAGE_KEY_NOTIFS = 'rac_notifs_v2';
const LOCAL_STORAGE_KEY_AUTH = 'rac_current_user_v2';
const LOCAL_STORAGE_KEY_THEME = 'rac_theme_v1';

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [cars, setCars] = useState<Car[]>(INITIAL_CARS);
  const [contracts, setContracts] = useState<RentalContract[]>(INITIAL_CONTRACTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('light');

  // Hydrate from localStorage
  useEffect(() => {
    try {
      // Purge any lingering legacy keys or old mock accounts
      ['rac_users_v1', 'rac_cars_v1', 'rac_contracts_v1', 'rac_notifs_v1', 'rac_current_user_v1',
       'ijara_users_v6', 'ijara_cars_v6', 'ijara_contracts_v6', 'ijara_notifs_v6', 'ijara_current_user_v6'].forEach((k) => {
        try { localStorage.removeItem(k); } catch {}
      });

      const storedUsers = localStorage.getItem(LOCAL_STORAGE_KEY_USERS);
      const storedCars = localStorage.getItem(LOCAL_STORAGE_KEY_CARS);
      const storedContracts = localStorage.getItem(LOCAL_STORAGE_KEY_CONTRACTS);
      const storedNotifs = localStorage.getItem(LOCAL_STORAGE_KEY_NOTIFS);
      const storedAuth = localStorage.getItem(LOCAL_STORAGE_KEY_AUTH);
      const storedTheme = localStorage.getItem(LOCAL_STORAGE_KEY_THEME) as 'dark' | 'light' | null;

      if (storedUsers) {
        try {
          const parsedUsers: User[] = JSON.parse(storedUsers);
          const cleaned = parsedUsers.filter((u) => u.id !== 'user-driver-1' && !u.name.toLowerCase().includes('aziz'));
          setUsers(cleaned.length > 0 ? cleaned : INITIAL_USERS);
        } catch {
          setUsers(INITIAL_USERS);
        }
      } else {
        setUsers(INITIAL_USERS);
      }

      if (storedCars) {
        try {
          const parsedCars: Car[] = JSON.parse(storedCars);
          setCars(parsedCars.length > 0 ? parsedCars : INITIAL_CARS);
        } catch {
          setCars(INITIAL_CARS);
        }
      } else {
        setCars(INITIAL_CARS);
      }

      if (storedContracts) {
        try {
          const parsedContracts: RentalContract[] = JSON.parse(storedContracts);
          setContracts(parsedContracts.length > 0 ? parsedContracts : INITIAL_CONTRACTS);
        } catch {
          setContracts(INITIAL_CONTRACTS);
        }
      } else {
        setContracts(INITIAL_CONTRACTS);
      }

      if (storedNotifs) {
        try {
          setNotifications(JSON.parse(storedNotifs));
        } catch {}
      }

      if (storedAuth) {
        try {
          const parsedUser: User = JSON.parse(storedAuth);
          // Ensure Aziz is purged from auth
          if (parsedUser.id === 'user-driver-1' || parsedUser.name.toLowerCase().includes('aziz')) {
            localStorage.removeItem(LOCAL_STORAGE_KEY_AUTH);
            setCurrentUser(null);
          } else {
            setCurrentUser(parsedUser);
          }
        } catch {
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }

      if (storedTheme) {
        setTheme(storedTheme);
        document.documentElement.setAttribute('data-theme', storedTheme);
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
      }
    } catch {
      // LocalStorage errors handled
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_USERS, JSON.stringify(users));
      localStorage.setItem(LOCAL_STORAGE_KEY_CARS, JSON.stringify(cars));
      localStorage.setItem(LOCAL_STORAGE_KEY_CONTRACTS, JSON.stringify(contracts));
      localStorage.setItem(LOCAL_STORAGE_KEY_NOTIFS, JSON.stringify(notifications));
      if (currentUser) {
        localStorage.setItem(LOCAL_STORAGE_KEY_AUTH, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEY_AUTH);
      }
    } catch {
      // Storage error handled
    }
  }, [users, cars, contracts, notifications, currentUser, isHydrated]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem(LOCAL_STORAGE_KEY_THEME, nextTheme);
  };

  const showToast = (title: string, message: string, type: ToastMessage['type'] = 'success') => {
    const newToast: ToastMessage = {
      id: 'toast-' + Date.now(),
      type,
      title,
      message,
    };
    setToast(newToast);
    if (isSoundEnabled) {
      playNotificationChime();
    }
    setTimeout(() => {
      setToast((prev) => (prev?.id === newToast.id ? null : prev));
    }, 4500);
  };

  const hideToast = () => setToast(null);

  const toggleSound = () => {
    setIsSoundEnabled((prev) => !prev);
  };

  const switchUserRole = (role: UserRole) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, role };
      setCurrentUser(updatedUser);
      setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));
      showToast(
        "Rol o'zgartirildi",
        `Hozirgi rolingiz: ${role === 'owner' ? 'Arendator / Egasi' : role === 'driver' ? 'Haydovchi' : 'Administrator'}`,
        'info'
      );
      return;
    }
    const targetUser = users.find((u) => u.role === role);
    if (targetUser) {
      setCurrentUser(targetUser);
      showToast(
        "Profil tanlandi",
        `Profil: ${targetUser.name} (${role === 'owner' ? 'Arendator' : 'Haydovchi'})`,
        'info'
      );
    }
  };

  // REGISTER USER WITH ROLE SELECTION
  const registerUser = ({ name, phone, password, role }: RegisterParams): { success: boolean; user?: User; error?: string } => {
    const cleanPhone = phone.trim();
    const cleanName = name.trim();

    if (!cleanPhone || cleanPhone.length < 9) {
      showToast("Xatolik", "Iltimos, to'g'ri telefon raqam kiriting.", "error");
      return { success: false, error: "Telefon raqam noto'g'ri" };
    }

    if (!cleanName) {
      showToast("Xatolik", "Iltimos, ism va familiyangizni kiriting.", "error");
      return { success: false, error: "Ism kiritilmadi" };
    }

    // Check if phone already registered
    const existing = users.find((u) => u.phone.replace(/\D/g, '') === cleanPhone.replace(/\D/g, ''));
    if (existing) {
      // Update role if changed
      const updated = { ...existing, role, name: cleanName || existing.name };
      setUsers((prev) => prev.map((u) => (u.id === existing.id ? updated : u)));
      setCurrentUser(updated);
      showToast(
        "Akkaunt mavjud",
        `Hurmatli ${updated.name}, siz ${role === 'owner' ? 'Arendator' : 'Haydovchi'} sifatida kirdingiz.`,
        "success"
      );
      return { success: true, user: updated };
    }

    const autoPass = password || `RAC-${cleanPhone.replace(/\D/g, '').slice(-4)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newUser: User = {
      id: `user-${role}-${Date.now()}`,
      name: cleanName,
      phone: cleanPhone,
      role,
      passwordAutoSaved: true,
      savedPasswordHash: autoPass,
      balance: role === 'owner' ? 2500000 : 500000,
      totalEarnings: 0,
      totalSpent: 0,
      rating: 5.0,
      activeContractsCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    };

    setUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);

    showToast(
      "Akkaunt yaratildi!",
      `Xush kelibsiz, ${newUser.name}! Siz ${role === 'owner' ? 'Arendator' : 'Haydovchi'} sifatida muvaffaqiyatli ro'yxatdan o'tdingiz.`,
      "success"
    );

    return { success: true, user: newUser };
  };

  // LOGIN USER WITH ROLE
  const loginUser = (phone: string, password?: string, preferredRole?: UserRole): { success: boolean; user?: User; error?: string } => {
    const cleanDigits = phone.replace(/\D/g, '');
    if (!cleanDigits || cleanDigits.length < 7) {
      showToast("Xatolik", "Iltimos, telefon raqamingizni to'liq kiriting.", "error");
      return { success: false, error: "Telefon raqam noto'g'ri" };
    }

    const found = users.find((u) => u.phone.replace(/\D/g, '').includes(cleanDigits) || cleanDigits.includes(u.phone.replace(/\D/g, '')));

    if (!found) {
      // Auto-register if user just inputs their phone
      const fallbackRole: UserRole = preferredRole || 'driver';
      const autoPass = password || `RAC-${cleanDigits.slice(-4)}-${Math.floor(1000 + Math.random() * 9000)}`;
      const newUser: User = {
        id: `user-${fallbackRole}-${Date.now()}`,
        name: `Foydalanuvchi (${cleanDigits.slice(-4)})`,
        phone: phone.startsWith('+') ? phone : `+998 ${cleanDigits.slice(-9)}`,
        role: fallbackRole,
        passwordAutoSaved: true,
        savedPasswordHash: autoPass,
        balance: fallbackRole === 'owner' ? 2500000 : 500000,
        totalEarnings: 0,
        totalSpent: 0,
        rating: 5.0,
        activeContractsCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
      };

      setUsers((prev) => [newUser, ...prev]);
      setCurrentUser(newUser);

      showToast(
        "Xush kelibsiz!",
        `Yangi akkaunt ochildi va ${fallbackRole === 'owner' ? 'Arendator' : 'Haydovchi'} sifatida kirdingiz.`,
        "success"
      );
      return { success: true, user: newUser };
    }

    const userToLogin = preferredRole && found.role !== preferredRole ? { ...found, role: preferredRole } : found;
    setCurrentUser(userToLogin);
    setUsers((prev) => prev.map((u) => (u.id === userToLogin.id ? userToLogin : u)));

    showToast(
      "Xush kelibsiz!",
      `Salom, ${userToLogin.name}! Siz ${userToLogin.role === 'owner' ? 'Arendator' : 'Haydovchi'} sifatida tizimga kirdingiz.`,
      "success"
    );

    return { success: true, user: userToLogin };
  };

  // Phone registration with AUTO-SAVED password (compatibility)
  const loginWithPhone = (phone: string, name: string, role: UserRole) => {
    const res = registerUser({ name, phone, role });
    return {
      autoPassword: res.user?.savedPasswordHash || 'RAC-AUTO-PASS',
      user: res.user || users[0],
    };
  };

  const loginWithSavedPassword = (phone: string): boolean => {
    const res = loginUser(phone);
    return res.success;
  };

  const loginWithGoogle = async (role: UserRole = 'driver'): Promise<{ success: boolean; user?: User; error?: string }> => {
    try {
      const res = await signInWithGooglePopup();
      if (!res.success || !res.user) {
        if (res.error) {
          showToast("Google orqali kirish amalga oshmadi", res.error, "error");
        }
        return { success: false, error: res.error };
      }

      const gUser = res.user;
      const existingUser = users.find(
        (u) => (gUser.email && u.email === gUser.email) || u.id === `user-google-${gUser.uid}`
      );

      if (existingUser) {
        const updated = { ...existingUser, role };
        setCurrentUser(updated);
        setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
        showToast(
          "Google orqali kirdingiz!",
          `Xush kelibsiz, ${updated.name}! (${role === 'owner' ? 'Arendator' : 'Haydovchi'})`,
          "success"
        );
        return { success: true, user: updated };
      }

      const newUser: User = {
        id: `user-google-${gUser.uid}`,
        name: gUser.displayName || 'Google Foydalanuvchisi',
        phone: '+998 90 *** ** **',
        email: gUser.email || undefined,
        authProvider: 'google',
        role,
        passwordAutoSaved: true,
        avatar: gUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        balance: role === 'owner' ? 2500000 : 500000,
        totalEarnings: 0,
        totalSpent: 0,
        rating: 5.0,
        activeContractsCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
      };

      setUsers((prev) => [newUser, ...prev]);
      setCurrentUser(newUser);

      showToast(
        "Google orqali kirdingiz!",
        `Salom, ${newUser.name}! Siz ${role === 'owner' ? 'Arendator' : 'Haydovchi'} sifatida ro'yxatdan o'tdingiz.`,
        "success"
      );

      return { success: true, user: newUser };
    } catch (err: any) {
      console.error("Google login error:", err);
      showToast("Xatolik", "Google orqali kirishda kutilmagan xatolik yuz berdi.", "error");
      return { success: false, error: err?.message };
    }
  };

  const logout = () => {
    signOutFromFirebase();
    setCurrentUser(null);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY_AUTH);
    } catch {}
    showToast('Tizimdan chiqildi', 'Siz hisobingizdan chiqdingiz. Qaytadan kirish uchun login oynasidan foydalaning.', 'info');
  };

  // ADD CAR - STRICTLY FOR OWNERS ONLY
  const addCar = (carData: Omit<Car, 'id' | 'createdAt' | 'ownerId' | 'ownerName' | 'ownerPhone' | 'status'>) => {
    if (!currentUser) {
      showToast("Avtorizatsiya talab etiladi", "Mashina qo'shish uchun avval Arendator sifatida kiring.", "error");
      return { success: false, message: "Avtorizatsiya talab etiladi" };
    }

    if (currentUser.role !== 'owner' && currentUser.role !== 'admin') {
      showToast(
        "Ruxsat berilmadi!",
        "Bu saytga faqatgina Arendatorlar (mashina egalari) mashina qo'sha oladi! Haydovchilar faqat ijaraga olishi mumkin.",
        "warning"
      );
      return {
        success: false,
        message: "Faqatgina Arendatorlar mashina qo'shishi mumkin."
      };
    }

    const newCar: Car = {
      ...carData,
      id: `car-${Date.now()}`,
      ownerId: currentUser.id,
      ownerName: currentUser.name,
      ownerPhone: currentUser.phone,
      status: 'available',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setCars((prev) => [newCar, ...prev]);

    const carNotif: NotificationItem = {
      id: `notif-car-${Date.now()}`,
      type: 'car_added',
      title: '🚗 Yangi mashina flotga qo\'shildi',
      message: `${newCar.title} (${newCar.plateNumber}) muvaffaqiyatli katalogga qo'shildi va arendaga tayyor.`,
      recipientRole: 'owner',
      recipientId: currentUser.id,
      carId: newCar.id,
      carPlate: newCar.plateNumber,
      isRead: false,
      sentAt: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
      smsDelivered: true,
      channel: 'in_app'
    };

    setNotifications((prev) => [carNotif, ...prev]);

    showToast(
      "Mashina muvaffaqiyatli qo'shildi!",
      `${newCar.title} (${newCar.plateNumber}) umumiy katalogga va shaxsiy avtoparkingizga joylashtirildi.`,
      "success"
    );

    return { success: true, message: "Mashina qo'shildi", car: newCar };
  };

  const updateCarStatus = (carId: string, status: Car['status']) => {
    setCars((prev) =>
      prev.map((c) => (c.id === carId ? { ...c, status } : c))
    );
    showToast("Status yangilandi", `Avtomobil holati yangilandi.`, "info");
  };

  // DUAL NOTIFICATION TRIGGER
  const sendDualPaymentReminder = (contractId: string) => {
    const contract = contracts.find((c) => c.id === contractId);
    if (!contract) return;

    const timestamp = new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
    const formattedAmount = contract.dailyRate.toLocaleString('uz-UZ');

    const ownerNotif: NotificationItem = {
      id: `notif-owner-${Date.now()}-${Math.random()}`,
      type: 'payment_reminder',
      title: `🔔 [ARENDATOR UCHUN] To'lov vaqti keldi!`,
      message: `Haydovchi ${contract.driverName} (${contract.carTitle}, ${contract.carPlate}) bo'yicha bugungi ${formattedAmount} so'm ijara to'lovi vaqti keldi.`,
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

    const driverNotif: NotificationItem = {
      id: `notif-driver-${Date.now()}-${Math.random()}`,
      type: 'payment_reminder',
      title: `⚠️ [HAYDOVCHI UCHUN] Bugungi to'lov muddati yetib keldi!`,
      message: `Hurmatli ${contract.driverName}, shartnoma #${contract.contractNumber} bo'yicha bugungi ${formattedAmount} so'm ijara to'lovini amalga oshirish vaqti keldi.`,
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

    setNotifications((prev) => [ownerNotif, driverNotif, ...prev]);

    setContracts((prev) =>
      prev.map((c) => (c.id === contractId ? { ...c, paymentStatus: 'due_today' } : c))
    );

    if (isSoundEnabled) {
      playNotificationChime();
    }

    showToast(
      "To'lov xabari har ikki tomonga bordi!",
      `1) Arendatorga (${contract.ownerName}) va 2) Haydovchiga (${contract.driverName}) sayt orqali to'lov eslatmasi va SMS yuborildi.`,
      'warning'
    );
  };

  const processPayment = (contractId: string, amount: number, method: 'Click' | 'Payme' | 'Uzum' | 'Naqd') => {
    const contract = contracts.find((c) => c.id === contractId);
    if (!contract) return;

    const formattedAmount = amount.toLocaleString('uz-UZ');
    const timestamp = new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
    const today = new Date().toISOString().split('T')[0];

    setContracts((prev) =>
      prev.map((c) => {
        if (c.id === contractId) {
          return {
            ...c,
            paymentStatus: 'paid',
            overdueDays: 0,
            penaltyFee: 0,
            totalPaid: c.totalPaid + amount,
            paymentHistory: [
              {
                id: `pay-${Date.now()}`,
                date: today,
                amount,
                method,
                status: 'success',
              },
              ...c.paymentHistory,
            ],
          };
        }
        return c;
      })
    );

    const ownerSuccessNotif: NotificationItem = {
      id: `pay-owner-${Date.now()}`,
      type: 'payment_received',
      title: `💰 [ARENDATOR UCHUN] To'lov qabul qilindi!`,
      message: `Haydovchi ${contract.driverName} ${formattedAmount} so'm to'lovni (${method} orqali) to'ladi. Balansingiz to'ldirildi.`,
      recipientRole: 'owner',
      recipientId: contract.ownerId,
      carPlate: contract.carPlate,
      contractId: contract.id,
      amount,
      isRead: false,
      sentAt: timestamp,
      smsDelivered: true,
      channel: 'dual',
    };

    const driverSuccessNotif: NotificationItem = {
      id: `pay-driver-${Date.now()}`,
      type: 'payment_received',
      title: `✅ [HAYDOVCHI UCHUN] To'lovingiz tasdiqlandi!`,
      message: `Hurmatli ${contract.driverName}, #${contract.contractNumber} shartnoma bo'yicha ${formattedAmount} so'm to'lov qabul qilindi. Rahmat!`,
      recipientRole: 'driver',
      recipientId: contract.driverId,
      carPlate: contract.carPlate,
      contractId: contract.id,
      amount,
      isRead: false,
      sentAt: timestamp,
      smsDelivered: true,
      channel: 'dual',
    };

    setNotifications((prev) => [ownerSuccessNotif, driverSuccessNotif, ...prev]);

    showToast(
      "To'lov muvaffaqiyatli o'tdi!",
      `${formattedAmount} so'm to'lov qabul qilindi. Har ikki tomonga tasdiqnoma bordi.`,
      'success'
    );
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showToast("Tozalandi", "Barcha bildirishnomalar o'qilgan deb belgilandi.", "info");
  };

  const unreadCount = notifications.filter((n) => {
    if (!currentUser) return !n.isRead;
    if (currentUser.role === 'admin') return !n.isRead;
    return !n.isRead && (n.recipientRole === currentUser.role || n.recipientRole === 'both');
  }).length;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        cars,
        contracts,
        notifications,
        unreadCount,
        toast,
        isSoundEnabled,
        isHydrated,
        toggleSound,
        showToast,
        hideToast,
        switchUserRole,
        registerUser,
        loginUser,
        loginWithPhone,
        loginWithSavedPassword,
        loginWithGoogle,
        logout,
        addCar,
        updateCarStatus,
        sendDualPaymentReminder,
        processPayment,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        theme,
        toggleTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
