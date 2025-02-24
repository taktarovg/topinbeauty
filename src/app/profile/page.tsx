// src/app/profile/page.tsx

'use client'

import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { UserProfileCard } from '@/components/profile/UserProfileCard';
import { cookies } from 'next/headers'; // Добавляем импорт cookies
import { NextRequest } from 'next/server'; // Добавляем импорт NextRequest

export default async function ProfilePage() {
  // Создаем объект request с использованием cookies
  const cookieStore = cookies();
  const token = cookieStore.get('sessionToken')?.value;
  const request = {
    headers: new Headers({
      'Authorization': token ? `Bearer ${token}` : '',
    }),
  } as NextRequest;

  const session = await getSession(request);
  if (!session?.user) { // Обновляем проверку на session.user
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { 
      id: session.user.id,
    },
    include: {
      city: true,
      district: true,
      masterProfile: {
        include: {
          services: true, // Добавляем включение услуг
        },
      },
    },
  });

  console.log('Fetched user data:', user);

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="container max-w-2xl mx-auto p-4">
      <UserProfileCard user={user} />
    </div>
  );
}