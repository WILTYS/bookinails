import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Clock, Euro } from 'lucide-react'
import { format, addDays, startOfWeek, isSameDay, isToday, isBefore } from 'date-fns'
import { fr } from 'date-fns/locale'
import { TimeSlot } from '@/types'

interface CalendarProps {
  salonId: number;
  onSlotSelect: (date: Date, time: string, price: number) => void;
  selectedDate?: Date;
  selectedTime?: string;
}

export default function Calendar({ salonId, onSlotSelect, selectedDate, selectedTime }: CalendarProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [availableSlots, setAvailableSlots] = useState<{ [key: string]: TimeSlot[] }>({})
  const [loading, setLoading] = useState(false)

  // Generate week days
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }) // Monday start
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  // Intelligent slot generation with collision detection
  const generateAvailableSlots = async (date: Date, salonId: number): Promise<TimeSlot[]> => {
    const today = new Date()
    if (isBefore(date, today)) return []

    try {
      // Fetch salon working hours and existing reservations
      const response = await fetch(`/api/salons/${salonId}/availability?date=${format(date, 'yyyy-MM-dd')}`)
      const data = await response.json()
      
      return data.slots || []
    } catch (error) {
      console.error('Error fetching availability:', error)
      return generateFallbackSlots(date)
    }
  }

  const generateFallbackSlots = (date: Date): TimeSlot[] => {
    const slots: TimeSlot[] = []
    const startHour = 9
    const endHour = 18
    const currentTime = new Date()
    const isToday = isSameDay(date, currentTime)

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) { // 30-min slots
        const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        const slotDateTime = new Date(date)
        slotDateTime.setHours(hour, minute, 0, 0)
        
        // Skip past slots for today
        const isPastSlot = isToday && slotDateTime <= currentTime
        
        // Mock availability (in real app, check against existing reservations)
        const isAvailable = !isPastSlot && Math.random() > 0.2 // 80% availability
        
        slots.push({
          time: timeStr,
          available: isAvailable,
          price: 45.0
        })
      }
    }

    return slots
  }

  // Load slots for current week
  useEffect(() => {
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      const newSlots: { [key: string]: TimeSlot[] } = {}
      
      weekDays.forEach(day => {
        const dateKey = format(day, 'yyyy-MM-dd')
        newSlots[dateKey] = generateFallbackSlots(day)
      })
      
      setAvailableSlots(newSlots)
      setLoading(false)
    }, 300)
  }, [currentWeek])

  const goToPreviousWeek = () => {
    setCurrentWeek(addDays(currentWeek, -7))
  }

  const goToNextWeek = () => {
    setCurrentWeek(addDays(currentWeek, 7))
  }

  const handleSlotClick = (date: Date, slot: TimeSlot) => {
    if (slot.available) {
      onSlotSelect(date, slot.time, slot.price)
    }
  }

  const isSelected = (date: Date, time: string) => {
    return selectedDate && selectedTime && 
           isSameDay(date, selectedDate) && 
           time === selectedTime
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Choisir un créneau
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={goToPreviousWeek}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium text-gray-600 min-w-[140px] text-center">
            {format(weekStart, 'dd MMM', { locale: fr })} - {format(addDays(weekStart, 6), 'dd MMM yyyy', { locale: fr })}
          </span>
          <button
            onClick={goToNextWeek}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
            <p className="text-gray-500 mt-2">Chargement des créneaux...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {weekDays.map((day, dayIndex) => {
              const dateKey = format(day, 'yyyy-MM-dd')
              const daySlots = availableSlots[dateKey] || []
              const availableCount = daySlots.filter(slot => slot.available).length
              const isPast = isBefore(day, new Date()) && !isToday(day)

              return (
                <div key={dayIndex} className={`${isPast ? 'opacity-50' : ''}`}>
                  {/* Day Header */}
                  <div className="mb-3 text-center">
                    <div className="text-sm font-medium text-gray-900">
                      {format(day, 'EEE', { locale: fr })}
                    </div>
                    <div className={`text-lg font-semibold ${
                      isToday(day) 
                        ? 'text-primary-500' 
                        : isPast 
                          ? 'text-gray-400' 
                          : 'text-gray-900'
                    }`}>
                      {format(day, 'dd')}
                    </div>
                    {availableCount > 0 && !isPast && (
                      <div className="text-xs text-green-600 mt-1">
                        {availableCount} créneaux
                      </div>
                    )}
                  </div>

                  {/* Time Slots */}
                  <div className="space-y-2">
                    {isPast ? (
                      <div className="text-xs text-gray-400 text-center py-4">
                        Passé
                      </div>
                    ) : daySlots.length === 0 ? (
                      <div className="text-xs text-gray-400 text-center py-4">
                        Fermé
                      </div>
                    ) : (
                      daySlots.slice(0, 4).map((slot, slotIndex) => ( // Show only first 4 slots
                        <button
                          key={slotIndex}
                          onClick={() => handleSlotClick(day, slot)}
                          disabled={!slot.available}
                          className={`w-full p-2 text-xs rounded-lg border transition-all ${
                            isSelected(day, slot.time)
                              ? 'bg-primary-500 text-white border-primary-500'
                              : slot.available
                                ? 'bg-white hover:bg-primary-50 border-gray-200 hover:border-primary-300 text-gray-900'
                                : 'bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          <div className="flex items-center justify-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{slot.time}</span>
                          </div>
                          {slot.available && (
                            <div className="flex items-center justify-center space-x-1 mt-1">
                              <Euro className="w-3 h-3" />
                              <span>{slot.price}€</span>
                            </div>
                          )}
                        </button>
                      ))
                    )}
                    
                    {daySlots.length > 4 && !isPast && (
                      <button className="w-full text-xs text-primary-500 hover:text-primary-600 py-1">
                        +{daySlots.length - 4} autres
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Selected Slot Info */}
      {selectedDate && selectedTime && (
        <div className="border-t border-gray-200 p-6 bg-primary-50">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Créneau sélectionné</h4>
              <p className="text-sm text-gray-600">
                {format(selectedDate, 'EEEE dd MMMM yyyy', { locale: fr })} à {selectedTime}
              </p>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-primary-600">45€</div>
              <div className="text-sm text-gray-600">1h00</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
