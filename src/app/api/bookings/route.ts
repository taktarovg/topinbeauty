// src/app/api/bookings/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendBookingNotification } from '@/lib/telegram';
import { bookingSchema } from '@/types/booking';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = bookingSchema.parse(body);

    const booking = await prisma.booking.create({
      data: {
        ...validatedData,
        userId: validatedData.userId,
        serviceId: validatedData.serviceId,
        masterId: validatedData.masterId,
      },
      include: {
        user: {
          select: {
            telegramId: true,
            firstName: true,
            lastName: true,
          },
        },
        service: {
          include: {
            master: {
              include: {
                user: {
                  select: {
                    telegramId: true,
                    firstName: true,
                    lastName: true,
                  },
                },
                city: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
                district: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
        master: {
          include: {
            city: {
              select: {
                id: true,
                name: true,
              },
            },
            district: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    await sendBookingNotification(booking);

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Booking creation error:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}