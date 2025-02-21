// // src/types/booking.ts - update
// import { type Booking, type Service, type User, type MasterProfile, BookingStatus } from '@prisma/client'

// export interface BookingWithRelations extends Booking {
//   service: Service
//   user: User
//   master: MasterProfile
// }

// src/types/booking.ts// src/types/booking.ts
import { Booking, User, Service, MasterProfile } from '@prisma/client';
import { z } from 'zod';

// Схема валидации для создания бронирования
export const bookingSchema = z.object({
  userId: z.number().int().positive(),
  serviceId: z.number().int().positive(),
  masterId: z.number().int().positive(),
  bookingDateTime: z.string().datetime(),
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELED', 'COMPLETED']).optional().default('PENDING'),
  cancelDeadline: z.string().datetime(), // Добавляем обязательное поле
  notes: z.string().optional().nullable(),
});

// Тип для бронирования с отношениями
export type BookingWithRelations = Booking & {
  user: Pick<User, 'telegramId' | 'firstName' | 'lastName'>;
  service: Service & {
    master: MasterProfile & {
      user: Pick<User, 'telegramId' | 'firstName' | 'lastName'>;
    };
  };
  master: MasterProfile;
};