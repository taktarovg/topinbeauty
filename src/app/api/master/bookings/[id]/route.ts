// src/app/api/master/bookings/[id]/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function GET(
  request: NextRequest, // Обновили тип для явности
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession(request); // Передаем request в getSession
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const booking = await prisma.booking.findUnique({
      where: {
        id: parseInt(params.id),
      },
      include: {
        user: true,
        service: true,
        master: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Проверяем, принадлежит ли бронирование мастеру
    if (booking.masterId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Master booking fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch booking' }, { status: 500 });
  }
}

// Пример метода PUT для обновления бронирования (если он есть в вашем проекте)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession(request); // Передаем request в getSession
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { status } = body; // Предполагаем, что мастер может обновить статус

    const booking = await prisma.booking.findUnique({
      where: {
        id: parseInt(params.id),
      },
      include: {
        master: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Проверяем, принадлежит ли бронирование мастеру
    if (booking.masterId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const updatedBooking = await prisma.booking.update({
      where: {
        id: parseInt(params.id),
      },
      data: {
        status: status, // Например, мастер подтверждает или отменяет бронирование
      },
      include: {
        user: true,
        service: true,
        master: true,
      },
    });

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error('Master booking update error:', error);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}