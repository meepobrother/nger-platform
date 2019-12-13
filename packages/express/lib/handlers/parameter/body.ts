import { Injector, StaticProvider } from "@nger/di";
import { IParameterDecorator } from '@nger/decorator'
import { WithPipesOptions, BodyMetadataKey, RequestToken, PipeTransform, ParameterHandler } from "@nger/core";

const handler: ParameterHandler = (handler: Function, parameters: any[], instance: any, injector: Injector, decorator: IParameterDecorator<any, WithPipesOptions>) => {
    const request = injector.get<any>(RequestToken);
    const query = Reflect.get(request, 'body');
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
export const bodyHandlerProvider: StaticProvider = {
    provide: BodyMetadataKey,
    useValue: handler
}
