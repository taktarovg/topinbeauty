// src/app/(public)/page.tsx

import { prisma } from '@/lib/prisma';
import { ServiceList } from '@/components/services/ServiceList';
import { FilterBar } from '@/components/services/FilterBar';
import { Skeleton } from '@/components/ui/skeleton';
import { unstable_noStore as noStore } from 'next/cache';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TopInBeauty - Главная',
  description: 'Найдите лучших мастеров красоты и забронируйте услуги онлайн через Telegram.',
};

interface HomePageProps {
  searchParams: {
    city?: string;
    district?: string;
    category?: string;
  };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  noStore();

  // Получаем услуги с подсчетом избранного
  const services = await prisma.service.findMany({
    where: {
      ...(searchParams.category && {
        categoryId: parseInt(searchParams.category),
      }),
      ...(searchParams.city && {
        master: { cityId: parseInt(searchParams.city) },
      }),
      ...(searchParams.district && {
        master: { districtId: parseInt(searchParams.district) },
      }),
    },
    include: {
      master: {
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              avatar: true,
              isPremium: true,
            },
          },
          city: true,
          district: true,
        },
      },
      category: {
        include: {
          parent: true,
        },
      },
      _count: {
        select: {
          favorites: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Получаем остальные данные для фильтров
  const [cities, districts, categories] = await Promise.all([
    prisma.city.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    }),
    prisma.district.findMany({
      select: {
        id: true,
        name: true,
        cityId: true,
      },
      orderBy: {
        name: 'asc',
      },
    }),
    prisma.category.findMany({
      where: {
        parentId: null,
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        order: 'asc',
      },
    }),
  ]);

  // Преобразуем данные для клиента
  const transformedServices = services.map((service) => ({
    id: service.id,
    title: service.name,
    price: Number(service.price),
    duration: `${service.duration} мин`,
    master: {
      name: `${service.master.user.firstName} ${service.master.user.lastName}`,
      isPremium: service.master.user.isPremium,
      avatar: service.master.user.avatar,
    },
    category: {
      parent: service.category.parent?.name,
      name: service.category.name,
    },
    location: {
      city: service.master.city.name,
      district: service.master.district.name,
    },
    stats: {
      views: service.viewsCount,
      favorites: service._count.favorites,
    },
    image: service.image,
  }));

  // Преобразуем категории для FilterBar
  const transformedCategories = categories.map((category) => ({
    id: category.id.toString(),
    name: category.name,
  }));

  return (
    <main className="max-w-md mx-auto pb-16">
      <FilterBar
        cities={cities}
        districts={districts}
        categories={transformedCategories}
      />
      <div className="space-y-4 p-2">
        <ServiceList services={transformedServices} />
      </div>
    </main>
  );
}