import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { getPersistentUploadDir } from '@/lib/storage-helper';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { success: false, error: 'No file provided' },
                { status: 400 }
            );
        }

        // Validate file type
        const allowedTypes = ['application/pdf'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { success: false, error: 'Only PDF files are allowed' },
                { status: 400 }
            );
        }

        // Create upload directory if it doesn't exist
        const persistentDir = await getPersistentUploadDir();
        const uploadDir = path.join(persistentDir, 'free-resources');
        await mkdir(uploadDir, { recursive: true });

        // Generate unique filename
        const timestamp = Date.now();
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filename = `${timestamp}-${sanitizedName}`;
        const filepath = path.join(uploadDir, filename);

        // Convert file to buffer and save
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filepath, buffer);

        // Return the public URL path
        const publicPath = `/uploads/free-resources/${filename}`;

        return NextResponse.json({
            success: true,
            url: publicPath
        });

    } catch (error) {
        console.error('File upload error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to upload file' },
            { status: 500 }
        );
    }
}
