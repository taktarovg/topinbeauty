// src/types/booking.ts
import type { Booking, Service, MasterProfile, User, City, District } from '@prisma/client';

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELED = 'CANCELED',
  COMPLETED = 'COMPLETED',
}

export type BookingWithRelations = Booking & {
  user: Pick<User, 'telegramId' | 'firstName' | 'lastName' | 'avatar'>; // Добавлено 'avatar'
  service: Service & {
    master: MasterProfile & {
      user: Pick<User, 'telegramId' | 'firstName' | 'lastName' | 'avatar'>;
      city: Pick<City, 'id' | 'name'>;
      district: Pick<District, 'id' | 'name'>;
    };
  };
  master: MasterProfile & {
    city: Pick<City, 'id' | 'name'>;
    district: Pick<District, 'id' | 'name'>;
    user: Pick<User, 'telegramId' | 'firstName' | 'lastName' | 'avatar'>;
  };
};

export type TimeSlot = {
  time: string;
  isAvailable: boolean;
  isPast: boolean;
};