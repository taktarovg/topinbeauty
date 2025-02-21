// src/app/api/bookings/route.ts - update

import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { addMinutes, isBefore, parseISO, startOfDay, endOfDay } from 'date-fns'
import { combineDateAndTime } from '@/lib/date-utils'
import { sendBookingNotification } from '@/lib/telegram'
import { BookingError, AuthenticationError } from '@/types/errors'

const createBookingSchema = z.object({
    serviceId: z.number(),
    date: z.string(),
    time: z.string(),
    notes: z.string().optional()
})

export async function POST(request: Request) {
    try {
        const session = await getSession()
        if (!session?.user) {
            throw new AuthenticationError()
        }

        const body = await request.json()
        const { serviceId, date, time, notes } = createBookingSchema.parse(body)

        // Преобразуем дату в начало и конец дня в формате ISO
        const parsedDate = parseISO(date)
        const dayStart = startOfDay(parsedDate)
        const dayEnd = endOfDay(parsedDate)

        // Получаем информацию об услуге и мастере
        const service = await prisma.service.findUnique({
            where: {
                id: serviceId
            },
            include: {
                master: {
                    include: {
                        settings: true,
                        daySchedules: {
                            where: {
                                date: {
                                    gte: dayStart,
                                    lte: dayEnd
                                }
                            }
                        },
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                                telegramId: true
                            }
                        }
                    }
                }
            }
        })

        if (!service) {
            throw new BookingError('Service not found')
        }

        const bookingDateTime = combineDateAndTime(parsedDate, time)

        // Проверяем, не прошло ли время записи
        if (isBefore(bookingDateTime, new Date())) {
            throw new BookingError('Cannot book for past time')
        }

        const daySchedule = service.master.daySchedules[0]
        if (!daySchedule) {
            throw new BookingError('No schedule available for this date')
        }

        // Проверяем, свободно ли время
        const existingBooking = await prisma.booking.findFirst({
            where: {
                masterId: service.masterId,
                bookingDateTime: {
                    gte: bookingDateTime,
                    lt: addMinutes(bookingDateTime, service.duration + (service.master.settings?.bufferTime || 0))
                },
                status: {
                    in: ['PENDING', 'CONFIRMED']
                }
            }
        })

        if (existingBooking) {
            throw new BookingError('Time slot is already booked')
        }

        // Создаем запись
        const booking = await prisma.booking.create({
            data: {
                userId: session.user.id,
                serviceId,
                masterId: service.masterId,
                bookingDateTime,
                notes,
                status: service.master.settings?.autoConfirm ? 'CONFIRMED' : 'PENDING',
                cancelDeadline: addMinutes(
                    bookingDateTime,
                    -(service.master.settings?.cancelDeadline || 24) * 60
                )
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
                                        telegramId: true
                                    }
                                }
                            }
                        }
                    }
                },
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        telegramId: true
                    }
                }
            }
        })

        // Отправляем уведомления через Telegram
        await sendBookingNotification(booking)

        return NextResponse.json(booking)
    } catch (error) {
        console.error('Booking creation error:', error)

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid input data', details: error.errors },
                { status: 400 }
            )
        }

        if (error instanceof BookingError) {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            )
        }

        if (error instanceof AuthenticationError) {
            return NextResponse.json(
                { error: error.message },
                { status: 401 }
            )
        }

        return NextResponse.json(
            { error: 'Failed to create booking' },
            { status: 500 }
        )
    }
}