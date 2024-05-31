import { Prisma } from '@prisma/client';

export type TUserWithPosition = Prisma.UserGetPayload<{
    include: {
        position: {
            select: {
                name: true,
            },
        };
    };
}>;
