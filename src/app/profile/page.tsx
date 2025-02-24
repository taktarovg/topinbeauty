// src/app/profile/page.tsx

// src/app/profile/page.tsx
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { UserProfileCard } from '@/components/profile/UserProfileCard';
import { cookies } from 'next/headers';

export default async function ProfilePage() {
  const cookieStore = cookies(); // Получаем объект cookies
  const session = await getSession({ cookies: cookieStore }); // Передаём cookieStore напрямую

  if (!session?.user) {
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
          services: true,
        },
      },
    },
  });

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="container max-w-2xl mx-auto p-4">
      <UserProfileCard user={user} />
    </div>
  );
}