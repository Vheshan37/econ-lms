'use server';

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function uploadImage(formData: FormData) {
    try {
        const file = formData.get('file') as File;
        if (!file) {
            return { success: false, error: 'No file provided' };
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create unique filename or use custom name
        const customName = formData.get('customName') as string;
        let filename;

        if (customName) {
            // Preserve extension
            const ext = file.name.split('.').pop();
            filename = `${customName}.${ext}`;
        } else {
            const uniqueId = uuidv4();
            const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '');
            filename = `${uniqueId}-${originalName}`;
        }


        // Determine upload directories
        const currentDir = process.cwd();
        const uploadDirs = [];

        // 1. Standard/Runtime public uploads
        const runtimeUploadDir = join(currentDir, 'public', 'uploads');
        uploadDirs.push(runtimeUploadDir);

        // 2. Persistent uploads (if running in standalone mode)
        // Standalone runs in .next/standalone, so persistent root is two levels up
        if (currentDir.includes('.next/standalone')) {
            const persistentUploadDir = join(currentDir, '../../public/uploads');
            uploadDirs.push(persistentUploadDir);
        }

        // Save file to all determined locations
        for (const dir of uploadDirs) {
            await mkdir(dir, { recursive: true });
            const filepath = join(dir, filename);
            await writeFile(filepath, buffer);
            console.log(`Saved image to: ${filepath}`);
        }


        // Return public path
        const publicPath = `/uploads/${filename}`;
        return { success: true, url: publicPath };

    } catch (error) {
        console.error('Error uploading file:', error);
        return { success: false, error: 'Failed to upload file' };
    }
}
