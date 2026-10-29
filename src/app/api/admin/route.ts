import { NextResponse } from 'next/server';
import { INITIAL_USERS, INITIAL_CARS, INITIAL_CONTRACTS } from '@/lib/mockData';

export async function GET() {
  const owners = INITIAL_USERS.filter((u) => u.role === 'owner').map((owner) => {
    const ownerCars = INITIAL_CARS.filter((c) => c.ownerId === owner.id);
    const ownerContracts = INITIAL_CONTRACTS.filter((ct) => ct.ownerId === owner.id);
    return {
      ...owner,
      carsCount: ownerCars.length,
      activeRentalsCount: ownerContracts.length,
      cars: ownerCars,
      monthlyExpectedIncome: ownerContracts.reduce((acc, c) => acc + c.dailyRate * 30, 0),
    };
  });

  const drivers = INITIAL_USERS.filter((u) => u.role === 'driver').map((driver) => {
    const activeContract = INITIAL_CONTRACTS.find((ct) => ct.driverId === driver.id);
    return {
      ...driver,
      activeContract: activeContract || null,
      paymentDiscipline: activeContract?.paymentStatus === 'overdue' ? 'Qarzdor' : 'Namunali',
      nextPaymentDate: activeContract?.nextPaymentDate || 'Mavjud emas',
      currentCarTitle: activeContract?.carTitle || 'Hozirda mashinasi yoq',
    };
  });

  const totalCars = INITIAL_CARS.length;
  const activeRentals = INITIAL_CONTRACTS.length;
  const todayDueCount = INITIAL_CONTRACTS.filter((c) => c.paymentStatus === 'due_today').length;
  const overdueCount = INITIAL_CONTRACTS.filter((c) => c.paymentStatus === 'overdue').length;

  return NextResponse.json({
    success: true,
    stats: {
      totalCars,
      activeRentals,
      todayDueCount,
      overdueCount,
      totalFleetValue: '2,450,000,000 UZS',
      monthlyTurnover: '48,200,000 UZS',
    },
    owners,
    drivers,
    contracts: INITIAL_CONTRACTS,
  });
}
