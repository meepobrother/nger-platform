import { createHmac, BinaryLike, Hmac, createHash, HashOptions, Hash } from 'crypto';
import { TransformOptions } from 'stream';
import { Injectable } from '@nger/di';
@Injectable()
export class Crypto {
    createHmac(algorithm: string, key: BinaryLike, options?: TransformOptions): Hmac {
        return createHmac(algorithm, key, options)
    }
    createHash(algorithm: string, options?: HashOptions): Hash {
        return createHash(algorithm, options)
    }
}