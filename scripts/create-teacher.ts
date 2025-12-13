import { createTeacher } from '@/lib/actions/auth';

// This script creates the initial teacher account
// Run with: node --loader ts-node/esm scripts/create-teacher.ts

async function main() {
    const name = process.argv[2];
    const email = process.argv[3];

    if (!name || !email) {
        console.error('Usage: npm run create-teacher <name> <email>');
        console.error('Example: npm run create-teacher "John Doe" "teacher@econ.lk"');
        process.exit(1);
    }

    console.log('Creating teacher account...');
    const result = await createTeacher(name, email);

    if (result.success) {
        console.log('✅ Teacher account created successfully!');
        console.log('Teacher:', result.teacher);
        console.log('\nYou can now login at /login using OTP authentication.');
    } else {
        console.error('❌ Failed to create teacher account:', result.error);
        process.exit(1);
    }
}

main();
