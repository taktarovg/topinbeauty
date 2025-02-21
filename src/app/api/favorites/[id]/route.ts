// src/app/api/favorites/[id]/route.ts - new
import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getSession()
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const serviceId = parseInt(params.id)

        await prisma.favorite.deleteMany({
            where: {
                userId: session.user.id,
                serviceId,
            },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Remove from favorites error:', error)
        return NextResponse.json(
            { error: 'Failed to remove from favorites' },
            { status: 500 }
        )
    }
}