import { createSafeActionClient } from 'next-safe-action';

export const actionClient = createSafeActionClient().use(
    async ({ next }) => {
        
        return next({});
    }
);
