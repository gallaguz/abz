import { createHash } from 'node:crypto';

export const hashFromString = (str: string): string => createHash('sha1')
    .update(JSON.stringify(str)).digest('hex');
