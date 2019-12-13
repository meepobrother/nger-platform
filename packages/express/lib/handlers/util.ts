import { createHash } from 'crypto';
export function createCid(str: string | Buffer): string {
    return createHash(`md5`).update(str).digest('hex')
}