import { join, resolve } from 'path';
import { mkdir } from 'fs/promises';

export async function getPersistentUploadDir() {
    const cwd = process.cwd();
    let uploadDir;

    // Detect if we are in .next/standalone
    if (cwd.includes('.next/standalone')) {
        // Go up two levels to reach project root (outside .next)
        uploadDir = resolve(cwd, '../../uploads');
    } else {
        // In dev or standard build, use project root
        uploadDir = join(cwd, 'uploads');
    }

    // Ensure directory exists
    await mkdir(uploadDir, { recursive: true });

    return uploadDir;
}
