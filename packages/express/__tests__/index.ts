import { Controller, Injector, Param, Get, Query, Cid, Module, OnModuleInit, CanActivate, Injectable, Session, Ip, Inject, RequestId } from '@nger/core';
import { expressPlatform } from '../lib';
@Injectable()
export class CanActiveIndex implements CanActivate {
    canActivate() {
        return true;
    }
}
@Injectable()
export class Demo {
    constructor(private injector: Injector) {
    }
    test() {
        const cid = this.injector.get(RequestId)
        return cid;
    }
}

@Controller({
    path: '/',
    useGuards: [CanActiveIndex],
    providers: [Demo]
})
export class DemoControler {
    constructor(private injector: Injector) { }

    @Get(`/`)
    onIndex(@Session() session: object, @Ip() ip: string, @Cid() cid: Buffer) {
        const views = Reflect.get(session, 'views') || 0;
        Reflect.set(session, 'views', views + 1);
        const requestId = this.injector.get(Demo).test();
        return { views, ip, cid, requestId };
    }

    @Get(`/param/:id`)
    onParam(@Param({ property: 'id' }) id: number, @Param() param: object) {
        return { id, param }
    }

    @Get(`/query/:id`)
    onQuery(@Query({ property: 'id' }) id: number, @Query() query: object) {
        return { id, query }
    }
}

@Module({
    providers: [
        CanActiveIndex
    ],
    controllers: [DemoControler]
})
export class AppModule implements OnModuleInit {
    constructor(private injector: Injector) { }
    ngOnModuleInit() { }
}

expressPlatform([]).bootstrapModule(AppModule).then(res => res.onInit()).then()
