import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        // Create teacher account
        const teacher = await prisma.teacher.create({
            data: {
                name: 'Vihanga Heshan',
                email: 'vihangaheshan37@gmail.com',
                isActive: true
            }
        });

        console.log('✅ Teacher account created successfully!');
        console.log('Teacher:', {
            id: teacher.id,
            name: teacher.name,
            email: teacher.email
        });
        console.log('\nYou can now login at /login using OTP authentication.');
    } catch (error) {
        if (error.code === 'P2002') {
            console.log('⚠️  Teacher account already exists with this email.');
        } else {
            console.error('❌ Failed to create teacher account:', error.message);
        }
    } finally {
        await prisma.$disconnect();
    }
}

main();
