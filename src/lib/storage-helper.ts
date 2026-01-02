import { join } from 'path';
import { mkdir } from 'fs/promises';

export async function getPersistentUploadDir() {
    // Check for an environment variable to support persistent storage outside the project root
    // This is crucial for standalone deployments (VPS/Docker)
    const envUploadDir = process.env.UPLOAD_DIR;
    
    // Fallback to project-root/public/uploads for local development
    const uploadDir = envUploadDir ? envUploadDir : join(process.cwd(), 'public', 'uploads');

    // Ensure directory exists
    await mkdir(uploadDir, { recursive: true });

    return uploadDir;
}
