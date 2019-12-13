import { Logger, LogLevel } from "@nger/core";
import { isObject } from './util';
import clc from 'cli-color';
const yellow = clc.xterm(3);
export class LoggerDefault extends Logger {
    logLevels: LogLevel[] = [
        'log',
        'error',
        'warn',
        'debug',
        'verbose',
    ];
    lastTimestamp: number;
    isTimestampEnabled: boolean;
    private isLogLevelEnabled(level: LogLevel): boolean {
        return this.logLevels.includes(level);
    }
    private printStackTrace(trace?: string) {
        if (!trace) {
            return;
        }
        process.stdout.write(`${trace}\n`);
    }
    private updateAndGetTimestampDiff(
        isTimeDiffEnabled?: boolean,
    ): string {
        const includeTimestamp = this.lastTimestamp && isTimeDiffEnabled;
        const result = includeTimestamp
            ? yellow(` +${Date.now() - this.lastTimestamp}ms`)
            : '';
        this.lastTimestamp = Date.now();
        return result;
    }
    private printMessage(
        message: any,
        color: (message: string) => string,
        context: string = ''
    ) {
        const isTimeDiffEnabled = this.isTimestampEnabled;
        const output = isObject(message)
            ? `${color('Object:')}\n${JSON.stringify(message, null, 2)}\n`
            : color(message);
        const localeStringOptions = {
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            day: '2-digit',
            month: '2-digit',
        };
        const timestamp = new Date(Date.now()).toLocaleString(
            undefined,
            localeStringOptions,
        );
        const pidMessage = color(`[Express] ${process.pid}   - `);
        const contextMessage = context ? yellow(`[${context}] `) : '';
        const timestampDiff = this.updateAndGetTimestampDiff(isTimeDiffEnabled);
        process.stdout.write(
            `${pidMessage}${timestamp}   ${contextMessage}${output}${timestampDiff}\n`,
        );
    }
    log(message: any, context?: string | undefined): void {
        if (!this.isLogLevelEnabled('log')) {
            return;
        }
        this.printMessage(message, clc.green, context);
    }
    error(message: any, trace?: string | undefined, context?: string | undefined): void {
        if (!this.isLogLevelEnabled('error')) {
            return;
        }
        this.printMessage(message, clc.red, context);
        this.printStackTrace(trace);
    }
    warn(message: any, context?: string | undefined): void {
        if (!this.isLogLevelEnabled('warn')) {
            return;
        }
        this.printMessage(message, clc.yellow, context);
    }
    debug(message: any, context?: string | undefined): void {
        if (!this.isLogLevelEnabled('debug')) {
            return;
        }
        this.printMessage(message, clc.magentaBright, context);
    }
    verbose(message: any, context?: string | undefined): void {
        if (!this.isLogLevelEnabled('verbose')) {
            return;
        }
        this.printMessage(message, clc.cyanBright, context);
    }
}
