// src/app/bookings/page.tsx

// src/app/bookings/page.tsx
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { ClientBookingsList } from '@/components/bookings/ClientBookingsList';
import { cookies } from 'next/headers';
import type { BookingWithRelations } from '@/types/booking';

export default async function BookingsPage() {
  const cookieStore = cookies(); // Получаем объект cookies
  const session = await getSession({ cookies: cookieStore }); // Передаём cookieStore напрямую

  if (!session?.user) {
    redirect('/login');
  }

  const bookings: BookingWithRelations[] = await prisma.booking.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      service: {
        include: {
          master: {
            include: {
              user: {
                select: {
                  telegramId: true,
                  firstName: true,
                  lastName: true,
                  avatar: true,
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
      user: {
        select: {
          telegramId: true,
          firstName: true,
          lastName: true,
          avatar: true,
        },
      },
      master: {
        include: {
          user: {
            select: {
              telegramId: true,
              firstName: true,
              lastName: true,
              avatar: true,
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
    orderBy: [
      { status: 'asc' },
      { bookingDateTime: 'asc' },
    ],
  });

  return (
    <div className="container max-w-2xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Мои записи</h1>
        <p className="text-muted-foreground mt-1">
          Управляйте своими записями к мастерам
        </p>
      </div>

      <ClientBookingsList bookings={bookings} />
    </div>
  );
}