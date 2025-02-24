//  src/actions/actions.ts

'use server';

import { prisma } from '@/lib/prisma';

export async function cancelBooking(bookingId: number) {
  try {
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CANCELED' },
    });
  } catch (error) {
    console.error('Failed to cancel booking:', error);
    throw new Error('Failed to cancel booking');
  }
}