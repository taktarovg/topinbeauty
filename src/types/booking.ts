// src/types/booking.ts
import { Booking, User, Service, MasterProfile } from '@prisma/client';
import { z } from 'zod';

// Определяем перечисление BookingStatus
export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELED = 'CANCELED',
  COMPLETED = 'COMPLETED',
}

// Схема валидации для создания бронирования
export const bookingSchema = z.object({
  userId: z.number().int().positive(),
  serviceId: z.number().int().positive(),
  masterId: z.number().int().positive(),
  bookingDateTime: z.string().datetime(),
  status: z.nativeEnum(BookingStatus).optional().default(BookingStatus.PENDING), // Обновили на nativeEnum
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