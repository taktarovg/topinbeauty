// src/components/services/ServiceFilters.tsx
'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface City {
  id: string
  name: string
}

interface District {
  id: string
  name: string
  cityId: string
}

interface Category {
  id: string
  name: string
}

interface ServiceFiltersProps {
  cities: City[]
  districts: District[]
  categories: Category[]
}

export function ServiceFilters({ cities, districts, categories }: ServiceFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || '')
  const [selectedDistrict, setSelectedDistrict] = useState(searchParams.get('district') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')

  const filteredDistricts = districts.filter(
    district => district.cityId === selectedCity
  )

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    
    // Если меняется город, сбрасываем район
    if (key === 'city') {
      params.delete('district')
    }

    router.push(`/?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-4 p-4">
      <Select
        value={selectedCity}
        onValueChange={(value) => {
          setSelectedCity(value)
          setSelectedDistrict('')
          updateFilters('city', value)
        }}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Выберите город" />
        </SelectTrigger>
        <SelectContent>
          {cities.map((city) => (
            <SelectItem key={city.id} value={city.id}>
              {city.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={selectedDistrict}
        onValueChange={(value) => {
          setSelectedDistrict(value)
          updateFilters('district', value)
        }}
        disabled={!selectedCity}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Выберите район" />
        </SelectTrigger>
        <SelectContent>
          {filteredDistricts.map((district) => (
            <SelectItem key={district.id} value={district.id}>
              {district.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={selectedCategory}
        onValueChange={(value) => {
          setSelectedCategory(value)
          updateFilters('category', value)
        }}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Выберите категорию" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}