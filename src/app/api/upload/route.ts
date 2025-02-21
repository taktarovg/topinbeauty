// src/app/api/upload/route.ts - new
import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { nanoid } from 'nanoid'
import sharp from 'sharp'
import { getSession } from '@/lib/session'

const UPLOADS_DIR = join(process.cwd(), 'public', 'uploads')

// Конфигурация для разных типов изображений
const imageConfigs = {
  service: {
    width: 800,
    height: 800,
    fit: 'cover' as const,
  },
  avatar: {
    width: 200,
    height: 200,
    fit: 'cover' as const,
  }
}

export async function POST(request: Request) {
  try {
    // Проверяем авторизацию
    const session = await getSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Создаем папку для загрузок, если её нет
    try {
      await mkdir(UPLOADS_DIR, { recursive: true })
    } catch (error) {
      if ((error as any).code !== 'EEXIST') {
        throw error
      }
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const type = formData.get('type') as keyof typeof imageConfigs | null

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    if (!type || !imageConfigs[type]) {
      return NextResponse.json(
        { error: 'Invalid image type' },
        { status: 400 }
      )
    }

    // Проверяем размер файла (10MB максимум)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB' },
        { status: 400 }
      )
    }

    // Проверяем тип файла
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Invalid file type. Only images are allowed' },
        { status: 400 }
      )
    }

    // Читаем файл
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Конфигурация для обработки изображения
    const config = imageConfigs[type]

    // Обрабатываем изображение
    const processedImage = await sharp(buffer)
      .resize(config.width, config.height, {
        fit: config.fit,
        position: 'center'
      })
      .webp({ quality: 80 })
      .toBuffer()

    // Генерируем уникальное имя файла
    const filename = `${nanoid()}.webp`
    const filepath = join(UPLOADS_DIR, filename)

    // Сохраняем файл
    await writeFile(filepath, processedImage)

    // Возвращаем URL файла
    const fileUrl = `/uploads/${filename}`

    return NextResponse.json({ url: fileUrl })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { 
        error: 'Upload failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}