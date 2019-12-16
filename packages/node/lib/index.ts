import { corePlatform, createPlatformFactory, LOGGER_LEVEL, LogLevel } from '@nger/core';
import { loggerProvider } from './logger';
import { ngerOrmCoreHandlers } from '@nger/orm.core'
export const platformNode = createPlatformFactory(corePlatform, 'node', [
    ...ngerOrmCoreHandlers,
    {
        provide: LOGGER_LEVEL,
        useValue: 'error' as LogLevel,
        multi: true
    },
    loggerProvider
]);
