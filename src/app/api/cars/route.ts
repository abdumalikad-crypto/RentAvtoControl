import { NextResponse } from 'next/server';
import { INITIAL_CARS } from '@/lib/mockData';
import { Car } from '@/types';

// In-memory cars store for backend API demonstration
let serverCars: Car[] = [...INITIAL_CARS];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const brand = searchParams.get('brand');
  const fuel = searchParams.get('fuel');
  const status = searchParams.get('status');
  const query = searchParams.get('q')?.toLowerCase();

  let filtered = [...serverCars];

  if (brand && brand !== 'all') {
    filtered = filtered.filter((c) => c.brand.toLowerCase() === brand.toLowerCase());
  }
  if (fuel && fuel !== 'all') {
    filtered = filtered.filter((c) => c.fuelType.toLowerCase() === fuel.toLowerCase());
  }
  if (status && status !== 'all') {
    filtered = filtered.filter((c) => c.status === status);
  }
  if (query) {
    filtered = filtered.filter(
      (c) =>
        c.title.toLowerCase().includes(query) ||
        c.plateNumber.toLowerCase().includes(query) ||
        c.location.toLowerCase().includes(query)
    );
  }

  return NextResponse.json({
    success: true,
    total: filtered.length,
    cars: filtered,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { role, carData, owner } = body;

    // Strict Backend Check: Only 'owner' or 'admin' can add cars!
    if (role !== 'owner' && role !== 'admin') {
      return NextResponse.json(
        {
          success: false,
          error: "Xatolik: Saytga faqatgina arendatorlar (mashina egalari) mashina qo'sha oladi!",
        },
        { status: 403 }
      );
    }

    const newCar: Car = {
      ...carData,
      id: `car-api-${Date.now()}`,
      ownerId: owner?.id || 'owner-default',
      ownerName: owner?.name || 'Arendator',
      ownerPhone: owner?.phone || '+998 90 000 00 00',
      status: 'available',
      createdAt: new Date().toISOString().split('T')[0],
    };

    serverCars.unshift(newCar);

    return NextResponse.json({
      success: true,
      message: "Mashina muvaffaqiyatli serverga qo'shildi",
      car: newCar,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Server xatosi: Maʼlumotlar toʻliq emas' },
      { status: 500 }
    );
  }
}
