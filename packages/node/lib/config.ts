import { Config, MAIN_PATH, Injector, isDevMode } from '@nger/core';
import { config } from 'dotenv';
import { dirname, join, extname } from 'path';
import { existsSync } from 'fs';
export function getEnvPath(path: string): string {
    const ext = extname(path)
    let dir = path;
    if (ext) dir = dirname(path)
    if (existsSync(join(dir, '.env'))) {
        return dir;
    }
    if (existsSync(join(dir, 'package.json'))) {
        return dir;
    }
    return getEnvPath(join(dir, '..'))
}
export class EnvConfig extends Config {
    constructor(private injector: Injector) {
        super();
        config({
            path: getEnvPath(this.injector.get<string>(MAIN_PATH)),
            encoding: 'utf8',
            debug: isDevMode()
        });
    }
    get<T = any>(key: string, def: T) {
        return Reflect.get(process.env, key) || def;
    }
}
