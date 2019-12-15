import { StaticProvider } from "@nger/di";
import { Logger } from "@nger/core";
import { LoggerDefault } from "./logger.default";

export const loggerProvider: StaticProvider = {
    provide: Logger,
    useClass: LoggerDefault,
    deps: []
};
