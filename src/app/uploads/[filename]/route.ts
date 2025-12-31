import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { getPersistentUploadDir } from '@/lib/storage-helper';

// Manual mime map to avoid dependency installation if possible
function getMimeType(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
        case 'png': return 'image/png';
        case 'jpg':
        case 'jpeg': return 'image/jpeg';
        case 'gif': return 'image/gif';
        case 'webp': return 'image/webp';
        case 'mp4': return 'video/mp4';
        case 'webm': return 'video/webm';
        case 'svg': return 'image/svg+xml';
        default: return 'application/octet-stream';
    }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ filename: string }> }) {
    const { filename } = await params;

    const uploadDir = await getPersistentUploadDir();
    const filepath = join(uploadDir, filename);

    if (!existsSync(filepath)) {
        return new NextResponse('File Not Found', { status: 404 });
    }

    try {
        const fileBuffer = await readFile(filepath);
        const contentType = getMimeType(filename);

        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch (error) {
        console.error('Error serving file:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
