import { Prisma, PrismaClient } from '@prisma/client';

const data: Prisma.CustomerCreateInput = {
    // deliberately empty to see missing properties
};

const unique: Prisma.CustomerWhereUniqueInput = {
    uuid: "123"
};
