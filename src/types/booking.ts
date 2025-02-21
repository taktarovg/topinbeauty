// src/types/booking.ts - update
import { type Booking, type Service, type User, type MasterProfile, BookingStatus } from '@prisma/client'

export interface BookingWithRelations extends Booking {
  service: Service
  user: User
  master: MasterProfile
}

export interface TimeSlot {
  time: string
  isAvailable: boolean
  isPast: boolean
}

export interface TimeSlotResponse {
  slots: TimeSlot[]
  availability: {
    totalSlots: number
    availableSlots: number
    isFullyBooked: boolean
    nextAvailableSlot?: string
  }
  schedule: {
    workHours: {
      start: string
      end: string
    }
    breaks: Array<{
      start: string
      end: string
    }>
    bufferTime: number
  }
}

export interface DaySchedule {
  date: Date
  slots: TimeSlot[]
  isWorkingDay: boolean
}

export interface BookingFormData {
  serviceId: number
  masterId: number
  date: Date
  time: string
  notes?: string
}

export type { BookingStatus }

export interface BookingFilters {
  status?: BookingStatus
  from?: Date
  to?: Date
  masterId?: number
}