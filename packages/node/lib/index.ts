import { corePlatform, createPlatformFactory, LOGGER_LEVEL, LogLevel, Config } from '@nger/core';
import { loggerProvider } from './logger';
import { ngerOrmCoreHandlers } from '@nger/orm.core'
import { EnvConfig } from './config';
import { Fs } from './fs';
import { Os } from './os';
import { Path } from './path';
import { Global } from './global';
import { Process } from './process';
import { ChildProcess } from './child_process';
import { QueryString } from './queryString';
import { Url } from './url';
export const platformNode = createPlatformFactory(corePlatform, 'node', [
    ...ngerOrmCoreHandlers,
    {
        provide: Crypto,
        useClass: Crypto
    },
    {
        provide: Fs,
        useClass: Fs
    },
    {
        provide: Os,
        useClass: Os
    },
    {
        provide: Console,
        useClass: Console
    },
    {
        provide: Path,
        useClass: Path
    },
    {
        provide: Config,
        useClass: EnvConfig
    },
    {
        provide: Global,
        useClass: Global
    },
    {
        provide: Process,
        useClass: Process
    },
    {
        provide: ChildProcess,
        useClass: ChildProcess
    },
    {
        provide: QueryString,
        useClass: QueryString
    },
    {
        provide: Url,
        useClass: Url
    },
    {
        provide: LOGGER_LEVEL,
        useValue: 'error' as LogLevel,
        multi: true
    },
    loggerProvider
]);
