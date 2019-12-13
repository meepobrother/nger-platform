import { Config } from '@nger/core';
import { config } from 'dotenv';
export class EnvConfig extends Config {
    constructor() {
        super();
        config();
    }
    get<T = any>(key: string, def: T) {
        return Reflect.get(process.env, key) || def;
    }
}