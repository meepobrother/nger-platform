import { corePlatform, createPlatformFactory, LOGGER_LEVEL, LogLevel } from '@nger/core';
import { loggerProvider } from './logger';
export const platformNode = createPlatformFactory(corePlatform, 'node', [
    {
        provide: LOGGER_LEVEL,
        useValue: 'error' as LogLevel,
        multi: true
    },
    loggerProvider
]);
