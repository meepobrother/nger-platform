import { ReducerOptions, StaticProvider, ReducerMetadataKey, CaseMetadataKey, Injector, Type, providerToStaticProvider } from "@nger/core";
import { IMethodDecorator, IClassDecorator, getINgerDecorator } from '@nger/decorator';
import { on, createReducer } from '@nger/rx.store';
export interface ReducerCaseHandler<T = any, O = any> {
    (instance: T, method: IMethodDecorator<T, O>): any;
}
export interface ReducerHandler<T = any, O = any> {
    (type: Type<any>, injector: Injector, decorator: IClassDecorator<T, O>): any;
}
const reducerHandler: ReducerHandler<any, ReducerOptions> = (type: Type<any>, injector: Injector, decorator: IClassDecorator<any, ReducerOptions>) => {
    const options = decorator.options;
    const handlers: any[] = [];
    injector.setStatic([providerToStaticProvider(type)]);
    const nger = getINgerDecorator(type)
    const instance = injector.get(type)
    if (options && nger) {
        const state = injector.get(options.store)
        nger.methods.map(method => {
            if (method.metadataKey) {
                const handler = injector.get<ReducerCaseHandler>(method.metadataKey)
                if (handler) {
                    const res = handler(instance, method);
                    if (res) handlers.push(res)
                }
            }
        });
        return { [`${options.name}`]: createReducer(state, ...handlers) }
    }
}
export const caseHandler: ReducerCaseHandler = (instance: any, method: IMethodDecorator<any, any>) => {
    const options = method.options;
    if (options) {
        const mth = Reflect.get(instance, method.property);
        if (mth) {
            return on(options, mth.bind(instance))
        }
    }
}
export const caseProvider: StaticProvider = {
    provide: CaseMetadataKey,
    useValue: caseHandler
}
export const reducerProvider: StaticProvider = {
    provide: ReducerMetadataKey,
    useValue: reducerHandler
}

export function getReducer(type: Type<any>, injector: Injector) {
    const nger = getINgerDecorator(type);
    let reducer: any;
    if (nger) {
        nger.classes.map(it => {
            const handler = injector.get<ReducerHandler>(it.metadataKey)
            if (handler) reducer = handler(type, injector, it)
        })
    }
    return reducer;
}