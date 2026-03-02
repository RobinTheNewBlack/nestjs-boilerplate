import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    await prisma.customer.create({
        data: {
            first_name: 'John',
            last_name: 'Doe',
            customer_code: 'C001',
            customer_type: 'RETAIL',
            email: 'john.doe@example.com',
            phone: '0800000000',
        },
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => await prisma.$disconnect());
