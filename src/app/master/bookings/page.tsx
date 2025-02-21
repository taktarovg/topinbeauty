// src/app/master/bookings/page.tsx - new
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { MasterBookingsManager } from '@/components/bookings/MasterBookingsManager'
import { useToast } from '@/components/ui/use-toast'
import { useAuthContext } from '@/providers/AuthProvider'
import type { BookingWithRelations, BookingStatus } from '@/types/booking'

export default function MasterBookingsPage() {
  const router = useRouter()
  const { user } = useAuthContext()
  const { toast } = useToast()
  const [bookings, setBookings] = useState<BookingWithRelations[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    if (user.role !== 'MASTER') {
      router.push('/')
      return
    }

    const fetchBookings = async () => {
      try {
        const response = await fetch('/api/master/bookings')
        if (!response.ok) {
          throw new Error('Failed to fetch bookings')
        }
        const data = await response.json()
        setBookings(data)
      } catch (error) {
        console.error('Bookings fetch error:', error)
        toast({
          title: 'Ошибка',
          description: 'Не удалось загрузить список записей',
          variant: 'destructive'
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchBookings()
  }, [user, router, toast])

  const handleStatusUpdate = async (bookingId: number, status: BookingStatus) => {
    try {
      const response = await fetch(`/api/master/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      })

      if (!response.ok) {
        throw new Error('Failed to update booking status')
      }

      const updatedBooking = await response.json()
      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId ? { ...booking, status } : booking
        )
      )
    } catch (error) {
      console.error('Status update error:', error)
      throw error
    }
  }

  if (isLoading) {
    return (
      <div className="container max-w-6xl mx-auto p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-[400px] bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-6xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Управление записями</h1>
        <p className="text-muted-foreground mt-1">
          Просматривайте и управляйте записями клиентов
        </p>
      </div>

      <MasterBookingsManager
        bookings={bookings}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  )
}