// src/components/ui/calendar.tsx - update
"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { ru } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { isSameDay } from "date-fns"

export interface CalendarProps extends React.ComponentProps<typeof DayPicker> {
  availableDates?: Date[]
  scheduledDays?: Date[]
  bookedDays?: Date[]
  fullyBookedDays?: Date[]
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  availableDates = [],
  scheduledDays = [],
  bookedDays = [],
  fullyBookedDays = [],
  disabled,
  selected,
  ...props
}: CalendarProps) {
  // Создаем модификаторы для разных состояний дней
  const modifiers = {
    available: availableDates,
    scheduled: scheduledDays,
    booked: bookedDays,
    fullyBooked: fullyBookedDays,
    disabled: (date: Date) => {
      // День недоступен если:
      // 1. Явно отключен через пропс disabled
      if (typeof disabled === 'function' && disabled(date)) {
        return true
      }
      // 2. Это прошедший день
      if (date < new Date(new Date().setHours(0, 0, 0, 0))) {
        return true
      }
      // 3. День не отмечен как доступный (если список доступных дней предоставлен)
      if (availableDates.length > 0 && !availableDates.some(d => isSameDay(d, date))) {
        return true
      }
      // 4. День полностью забронирован
      if (fullyBookedDays.some(d => isSameDay(d, date))) {
        return true
      }
      return false
    }
  }

  // Стили для модификаторов
  const modifiersStyles = {
    available: {
      backgroundColor: '#f0fdf4',
      color: '#166534',
      fontWeight: '500'
    },
    scheduled: {
      backgroundColor: '#dcfce7',
      color: '#166534'
    },
    booked: {
      backgroundColor: '#22c55e',
      color: 'white'
    },
    fullyBooked: {
      backgroundColor: '#fb923c',
      color: 'white'
    },
    today: {
      fontWeight: '600'
    },
    selected: {
      backgroundColor: '#3b82f6 !important',
      color: 'white !important',
      fontWeight: '600'
    }
  }

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      locale={ru}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex relative items-center justify-center pt-1 pb-4",
        caption_label: "text-sm font-medium",
        nav: "flex absolute inset-0 justify-between items-center",
        nav_button: cn(
          "h-7 w-7 bg-transparent p-0 hover:bg-accent rounded-lg transition-colors",
          "opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] h-9 text-center",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
          "first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
        ),
        day: cn(
          "h-9 w-9 p-0 font-normal rounded-lg transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          "focus:outline-none focus:ring-2 focus:ring-primary"
        ),
        day_range_end: "day-range-end",
        day_selected: "bg-primary text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50 cursor-not-allowed bg-muted/50",
        day_range_middle: "day-range-middle",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />
      }}
      modifiers={modifiers}
      modifiersStyles={modifiersStyles}
      selected={selected}
      disabled={modifiers.disabled}
      {...props}
    />
  )
}

Calendar.displayName = "Calendar"

export { Calendar }