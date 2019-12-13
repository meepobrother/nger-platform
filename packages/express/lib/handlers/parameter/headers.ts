import { Injector, Provider, StaticProvider } from "@nger/di";
import { WithPipesOptions, HeadersMetadataKey, RequestToken, PipeTransform, ParameterHandler } from "@nger/core";
import { IParameterDecorator } from '@nger/decorator'
const handler: ParameterHandler = (handler: Function, parameters: any[], instance: any, injector: Injector, decorator: IParameterDecorator<any, WithPipesOptions>) => {
    const request = injector.get<any>(RequestToken);
    const query = Reflect.get(request, 'headers');
    if (decorator.options) {
        const { property, usePipes } = decorator.options;
        let val = Reflect.get(query, property);
        if (usePipes) {
            const pipes = usePipes.map(it => injector.get(it, null)).filter(it => !!it) as any[];
            pipes.map((it: PipeTransform<any>) => {
                val = it.transform(val)
            });
        }
        Reflect.set(parameters, decorator.parameterIndex, val)
    } else {
        Reflect.set(parameters, decorator.parameterIndex, query)
    }
}
export const headersHandlerProvider: StaticProvider = {
    provide: HeadersMetadataKey,
    useValue: handler
}
