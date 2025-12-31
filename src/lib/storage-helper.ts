import { join } from 'path';
import { mkdir } from 'fs/promises';

export async function getPersistentUploadDir() {
    // Always use public/uploads directory
    // In development: project-root/public/uploads
    // In production standalone: .next/standalone/public/uploads
    // This works because Next.js copies public/ to standalone during build
    const uploadDir = join(process.cwd(), 'public', 'uploads');

    // Ensure directory exists
    await mkdir(uploadDir, { recursive: true });

    return uploadDir;
}
