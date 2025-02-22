// src/app/about/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="container max-w-2xl mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">О сервисе TopInBeauty</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h2 className="text-lg font-semibold">Наша миссия</h2>
            <p className="text-muted-foreground">
              TopInBeauty — это удобный сервис для записи к мастерам красоты через Telegram. Мы стремимся сделать процесс поиска и бронирования услуг простым, быстрым и доступным для каждого, соединяя клиентов с талантливыми мастерами в их городе.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Что мы предлагаем</h2>
            <ul className="list-disc pl-5 text-muted-foreground space-y-1">
              <li><strong>Поиск мастеров:</strong> Найдите лучших специалистов красоты рядом с вами — от парикмахеров до мастеров маникюра.</li>
              <li><strong>Онлайн-запись:</strong> Выберите удобное время и забронируйте услугу в несколько кликов.</li>
              <li><strong>Управление записями:</strong> Просматривайте, отменяйте или переносите свои бронирования в одном месте.</li>
              <li><strong>Персонализация:</strong> Сохраняйте любимых мастеров в избранное для быстрого доступа.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Почему выбирают нас</h2>
            <ul className="list-disc pl-5 text-muted-foreground space-y-1">
              <li><strong>Удобство:</strong> Весь процесс — от поиска до записи — прямо в Telegram.</li>
              <li><strong>Прозрачность:</strong> Актуальные цены, расписания и отзывы о мастерах.</li>
              <li><strong>Надёжность:</strong> Подтверждённые мастера и безопасное бронирование.</li>
              <li><strong>Экономия времени:</strong> Никаких звонков и долгих ожиданий — всё делается онлайн.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Начните прямо сейчас</h2>
            <p className="text-muted-foreground">
              Попробуйте TopInBeauty и откройте для себя новый уровень удобства в уходе за собой. Найдите своего мастера и забронируйте услугу уже сегодня!
            </p>
            <div className="mt-4">
              <Button asChild>
                <Link href="/">Найти мастера</Link>
              </Button>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}

export const metadata = {
  title: 'О сервисе - TopInBeauty',
  description: 'Узнайте больше о TopInBeauty — удобном сервисе для записи к мастерам красоты через Telegram.',
};