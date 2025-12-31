import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { verifyDevToken } from '@/lib/actions/dev-auth';
import { cookies } from 'next/headers';

const execPromise = promisify(exec);

export async function GET(req: NextRequest) {
    try {
        // 1. Authorization check
        const cookieStore = await cookies();
        const token = cookieStore.get('dev_session')?.value;
        if (!token) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const devSession = await verifyDevToken(token);
        if (!devSession) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        // 2. Parse Database URL using standard URL API
        const dbUrl = process.env.DATABASE_URL;
        if (!dbUrl) {
            return new NextResponse('DATABASE_URL not found', { status: 500 });
        }

        let user, password, host, port, database;
        try {
            const url = new URL(dbUrl);
            user = decodeURIComponent(url.username);
            password = decodeURIComponent(url.password);
            host = url.hostname;
            port = url.port || '3306';
            database = decodeURIComponent(url.pathname.substring(1));

            if (!user || !password || !database) {
                return new NextResponse('Invalid DATABASE_URL components', { status: 500 });
            }
        } catch (e) {
            return new NextResponse('Invalid DATABASE_URL format', { status: 500 });
        }

        // 3. Run mysqldump
        // We use -h, -u, -p options. -p followed by password (no space).
        // Note: This requires mysqldump to be installed on the system.
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `backup-${database}-${timestamp}.sql`;

        // Use a temporary command to avoid showing password in process list if possible, 
        // but for simplicity in a dev back-door:
        const command = `mysqldump -h ${host} -P ${port} -u ${user} -p'${password}' ${database}`;

        const { stdout, stderr } = await execPromise(command);

        if (stderr && !stderr.includes('password on the command line interface can be insecure')) {
            console.error('mysqldump error:', stderr);
            return new NextResponse('Backup failed', { status: 500 });
        }

        // 4. Return the SQL file
        return new NextResponse(stdout, {
            headers: {
                'Content-Type': 'application/sql',
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            },
        });

    } catch (error) {
        console.error('Database backup error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
