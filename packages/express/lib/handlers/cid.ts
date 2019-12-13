import { StaticProvider, Injector } from "@nger/di";
import { CidMetadataKey, ParameterHandler, RequestId } from "@nger/core";
import { IParameterDecorator } from '@nger/decorator';
const handler: ParameterHandler<any, any> = (handler: Function, parameters: Array<any>, instance: any, injector: Injector, parameter: IParameterDecorator<any, any>) => {
    const cid = injector.get(RequestId)
    Reflect.set(parameters, parameter.parameterIndex, cid);
}
export const cidProvider: StaticProvider = {
    provide: CidMetadataKey,
    useValue: handler
}