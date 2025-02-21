// src/app/profile/page.tsx - update
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { UserProfileCard } from '@/components/profile/UserProfileCard'

export default async function ProfilePage() {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { 
      id: session.user.id
    },
    include: {
      city: true,
      district: true,
      masterProfile: {
        include: {
          services: true // Добавляем включение услуг
        }
      }
    }
  })

  console.log('Fetched user data:', user)

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="container max-w-2xl mx-auto p-4">
      <UserProfileCard user={user} />
    </div>
  )
}