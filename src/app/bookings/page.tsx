// src/app/bookings/page.tsx - new

import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { ClientBookingsList } from '@/components/bookings/ClientBookingsList'

export default async function BookingsPage() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  const bookings = await prisma.booking.findMany({
    where: {
      userId: session.user.id
    },
    include: {
      service: {
        include: {
          master: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  avatar: true
                }
              },
              city: true,
              district: true
            }
          }
        }
      },
      user: {
        select: {
          firstName: true,
          lastName: true,
          avatar: true
        }
      }
    },
    orderBy: [
      { status: 'asc' },
      { bookingDateTime: 'asc' }
    ]
  })

  return (
    <div className="container max-w-2xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Мои записи</h1>
        <p className="text-muted-foreground mt-1">
          Управляйте своими записями к мастерам
        </p>
      </div>

      <ClientBookingsList
        bookings={bookings}
        onCancelBooking={async (bookingId: number) => {
          'use server'
          try {
            await prisma.booking.update({
              where: { id: bookingId },
              data: { status: 'CANCELED' }
            })
          } catch (error) {
            console.error('Failed to cancel booking:', error)
            throw new Error('Failed to cancel booking')
          }
        }}
      />
    </div>
  )
}