This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

```

```
topinbeauty
├─ eslint.config.mjs
├─ README.md
├─ tsconfig.json
├─ src
│  ├─ app
│  │  ├─ globals.css
│  │  ├─ layout.tsx
│  │  ├─ page.tsx
│  │  ├─ (auth)
│  │  │  ├─ login
│  │  │  │  └─ page.tsx
│  │  │  ├─ register
│  │  │  └─ layout.tsx
│  │  ├─ api
│  │  │  ├─ auth
│  │  │  │  ├─ telegram
│  │  │  │  │  └─ route.ts
│  │  │  │  └─ logout
│  │  │  │     └─ route.ts
│  │  │  ├─ services
│  │  │  │  ├─ route.ts
│  │  │  │  └─ [id]
│  │  │  │     ├─ available-dates
│  │  │  │     │  └─ route.ts
│  │  │  │     └─ time-slots
│  │  │  │        └─ route.ts
│  │  │  ├─ bookings
│  │  │  │  ├─ route.ts
│  │  │  │  └─ [id]
│  │  │  │     └─ route.ts
│  │  │  ├─ upload
│  │  │  │  └─ route.ts
│  │  │  ├─ profile
│  │  │  │  └─ route.ts
│  │  │  ├─ locations
│  │  │  │  └─ route.ts
│  │  │  ├─ categories
│  │  │  │  └─ route.ts
│  │  │  ├─ favorites
│  │  │  │  ├─ route.ts
│  │  │  │  └─ [id]
│  │  │  │     └─ route.ts
│  │  │  └─ master
│  │  │     ├─ schedule
│  │  │     │  ├─ route.ts
│  │  │     │  └─ [date]
│  │  │     │     ├─ route.ts
│  │  │     │     └─ post.ts
│  │  │     ├─ bookings
│  │  │     │  ├─ route.ts
│  │  │     │  └─ [id]
│  │  │     │     └─ route.ts
│  │  │     └─ settings
│  │  │        └─ route.ts
│  │  ├─ services
│  │  │  ├─ [id]
│  │  │  │  ├─ page.tsx
│  │  │  │  └─ book
│  │  │  │     └─ page.tsx
│  │  │  └─ create
│  │  │     └─ page.tsx
│  │  ├─ profile
│  │  │  ├─ [id]
│  │  │  ├─ page.tsx
│  │  │  └─ edit
│  │  │     └─ page.tsx
│  │  ├─ bookings
│  │  │  ├─ [id]
│  │  │  ├─ page.tsx
│  │  │  └─ loading.tsx
│  │  ├─ favicon.ico
│  │  ├─ favorites
│  │  │  └─ page.tsx
│  │  ├─ master
│  │  │  ├─ schedule
│  │  │  │  └─ page.tsx
│  │  │  └─ bookings
│  │  │     └─ page.tsx
│  │  ├─ not-found.tsx
│  │  └─ about
│  │     └─ page.tsx
│  ├─ components
│  │  ├─ ui
│  │  │  ├─ button.tsx
│  │  │  ├─ input.tsx
│  │  │  ├─ calendar.tsx
│  │  │  ├─ select.tsx
│  │  │  ├─ skeleton.tsx
│  │  │  ├─ FilterSelect.tsx
│  │  │  ├─ Tooltip.tsx
│  │  │  ├─ Avatar.tsx
│  │  │  ├─ dialog.tsx
│  │  │  ├─ toast.tsx
│  │  │  ├─ use-toast.ts
│  │  │  ├─ toaster.tsx
│  │  │  ├─ CityDistrictSelect.tsx
│  │  │  ├─ textarea.tsx
│  │  │  ├─ heading.tsx
│  │  │  ├─ alert.tsx
│  │  │  ├─ card.tsx
│  │  │  ├─ badge.tsx
│  │  │  ├─ switch.tsx
│  │  │  ├─ label.tsx
│  │  │  ├─ separator.tsx
│  │  │  ├─ scroll-area.tsx
│  │  │  ├─ alert-dialog.tsx
│  │  │  └─ theme.ts
│  │  ├─ layout
│  │  │  ├─ Header.tsx
│  │  │  ├─ Navigation.tsx
│  │  │  └─ SideMenu.tsx
│  │  ├─ services
│  │  │  ├─ ServiceCard.tsx
│  │  │  ├─ ServiceFilters.tsx
│  │  │  ├─ ServiceList.tsx
│  │  │  ├─ ServiceForm.tsx
│  │  │  ├─ FilterBar.tsx
│  │  │  ├─ ImageUpload.tsx
│  │  │  ├─ CategorySelect.tsx
│  │  │  ├─ CreateServiceForm.tsx
│  │  │  ├─ MasterInfo.tsx
│  │  │  ├─ ServicePriceDisplay.tsx
│  │  │  └─ ServiceDetail.tsx
│  │  ├─ bookings
│  │  │  ├─ BookingForm.tsx
│  │  │  ├─ TimeSlots.tsx
│  │  │  ├─ BookingList.tsx
│  │  │  ├─ Calendar.tsx
│  │  │  ├─ MasterBookingsManager.tsx
│  │  │  ├─ ClientBookingsList.tsx
│  │  │  ├─ CreateBookingForm.tsx
│  │  │  ├─ BookingStatusBadge.tsx
│  │  │  ├─ BookingCard.tsx
│  │  │  ├─ BookingFilters.tsx
│  │  │  └─ BookingSkeleton.tsx
│  │  ├─ telegram
│  │  │  ├─ TelegramAuth.tsx
│  │  │  └─ TelegramAutoAuth.tsx
│  │  ├─ profile
│  │  │  ├─ ImageUpload.tsx
│  │  │  └─ UserProfileCard.tsx
│  │  ├─ favorites
│  │  │  └─ FavoriteFilters.tsx
│  │  └─ schedule
│  │     ├─ ScheduleManager.tsx
│  │     ├─ ScheduleSettingsDialog.tsx
│  │     └─ MasterWorkspace.tsx
│  ├─ hooks
│  │  ├─ useAuth.ts
│  │  ├─ useFilters.ts
│  │  ├─ useFavorites.ts
│  │  ├─ useMasterBookings.ts
│  │  ├─ useMasterSchedule.ts
│  │  ├─ useBookings.ts
│  │  ├─ useTelegramAuth.ts
│  │  ├─ useWebAppBackButton.ts
│  │  └─ useWebAppMainButton.ts
│  ├─ lib
│  │  ├─ utils.ts
│  │  ├─ prisma.ts
│  │  ├─ session.ts
│  │  ├─ token.ts
│  │  ├─ date-utils.ts
│  │  ├─ telegram.ts
│  │  ├─ telegram-sdk.ts
│  │  └─ telegram-init.ts
│  ├─ store
│  │  └─ auth.ts
│  ├─ types
│  │  ├─ index.ts
│  │  ├─ profile.ts
│  │  ├─ favorite.ts
│  │  ├─ schedule.ts
│  │  ├─ booking.ts
│  │  ├─ errors.ts
│  │  └─ telegram.ts
│  ├─ providers
│  │  ├─ AuthProvider.tsx
│  │  └─ QueryProvider.tsx
│  ├─ middleware.ts
│  └─ pages
│     └─ preview.tsx
├─ package.json
├─ prisma
│  ├─ schema.prisma
│  └─ migrations
│     ├─ 20250211042623_tib_1102
│     │  └─ migration.sql
│     ├─ migration_lock.toml
│     ├─ 20250211091551_update_user_model
│     │  └─ migration.sql
│     ├─ 20250212061716_update_schema_with_relations
│     │  └─ migration.sql
│     ├─ 20250213064524_update_categories_schema
│     │  └─ migration.sql
│     └─ 20250213073543_add_master_profile_fields
│        └─ migration.sql
├─ scripts
├─ next.config.js
├─ package-lock.json
├─ tailwind.config.js
└─ postcss.config.js

```