import { createPlatformFactory, corePlatform } from '@nger/core'
import { reducerProvider, caseProvider } from './handler';
export const platformCore = createPlatformFactory(corePlatform, '@nger/platform.core', [
    reducerProvider,
    caseProvider
]);

export { getReducer } from './handler';
