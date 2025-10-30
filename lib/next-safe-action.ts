import { authOptions } from '@/app/lib/auth';
import { getServerSession } from 'next-auth/next';
import { createSafeActionClient } from 'next-safe-action';

export const actionClient = createSafeActionClient().use(
    async ({ next }) => {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            throw new Error("Unauthorized");
        }
        return next({
            ctx: {
                id: session.user,
            },
        });
    }
);
