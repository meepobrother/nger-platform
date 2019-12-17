import { ControllerFactory, ReducerOptions, StaticProvider, ReducerMetadataKey, CaseMetadataKey, RootActionReducerMapToken } from "@nger/core";
import { IMethodDecorator, IClassDecorator } from '@nger/decorator';
import { on, createReducer } from '@nger/rx.store';
export interface ReducerCaseHandler<T = any, O = any> {
    (instance: T, method: IMethodDecorator<T, O>): any;
}
export interface ReducerHandler<T = any, O = any> {
    (factory: ControllerFactory<T>, decorator: IClassDecorator<T, O>): any;
}
const reducerHandler: ReducerHandler<any, ReducerOptions> = (factory: ControllerFactory<any>, decorator: IClassDecorator<any, ReducerOptions>) => {
    const options = decorator.options;
    const instance = factory.create();
    const handlers: any[] = [];
    if (options) {
        const state = factory.injector.get(options.store)
        factory.metadata.methods.map(method => {
            if (method.metadataKey) {
                const handler = factory.injector.get<ReducerCaseHandler>(method.metadataKey)
                if (handler) {
                    const res = handler(instance, method);
                    if (res) handlers.push(res)
                }
            }
        });
        factory.injector.setStatic([{
            provide: RootActionReducerMapToken,
            useValue: {
                [`${options.name}`]: createReducer(state, ...handlers)
            },
            multi: true
        }]);
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