import { Config, MAIN_PATH, Injector, isDevMode } from '@nger/core';
import { config } from 'dotenv';
export function getEnvPath() { }
export class EnvConfig extends Config {
    constructor(private injector: Injector) {
        super();
        config({
            path: injector.get<string>(MAIN_PATH),
            encoding: 'utf8',
            debug: isDevMode()
        });
    }
    get<T = any>(key: string, def: T) {
        return Reflect.get(process.env, key) || def;
    }
}
